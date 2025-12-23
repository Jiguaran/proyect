import { Injectable } from '@angular/core';
import { Database } from '../models/supabase';
import {environment } from '../environments/environment';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BehaviorSubject,Observable, from, throwError, forkJoin } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';


type Client = Database['public']['Tables']['tf_15221']['Row'];

@Injectable({
  providedIn: 'root',
})
export class Tf {
  private supabase: SupabaseClient<Database> = createClient<Database>(
    environment.supabaseUrl,
    environment.supabaseKey
  );

  private readonly TABLE_NAME = 'tf_15221'; // variable con el nombre de la tabla que estaré usando

  private tfSubject = new BehaviorSubject<Client[]>([]); 
  public tf$ = this.tfSubject.asObservable();

  constructor() {}
  
getFotosAgrupadas(id: string, sufijo: string): Observable<any[]> {
    const nombreTabla = `tf_${sufijo}`;
    const tablaRelacion = `t6_${sufijo}`;
    const URL_BASE = `https://storage.googleapis.com/nutresa-7f30b.appspot.com/${sufijo}/img/`;

    return forkJoin({
      fotos: from(this.supabase.from(nombreTabla as any).select('*').eq('idencuesta', id.trim())),
      encuesta: from(this.supabase.from(tablaRelacion as any).select('*').eq('idencuesta', id.trim()))
    }).pipe(
      map(({ fotos, encuesta }: any) => {
        const dataFotos = fotos.data || [];
        const dataEncuesta = encuesta.data || [];

        // 1. Pre-procesamos la encuesta para generar el idPoc (1-1) y la base de comparación (1)
        const encuestasValidas = dataEncuesta
          .filter((e: any) => e.id === e.esp) // Tu regla de oro de T6
          .map((e: any) => ({
            ...e,
            idPocCompleto: `${e.id}-${e.esp}`,
            idBase: String(e.id) // El "1" para comparar con tf.idp
          }));

        // 2. Aplicamos la restricción cruzada
        const agrupado = dataFotos.reduce((acc: any, item: any) => {
          
          // Buscamos si el idp de la foto (ej: 1) coincide con el idBase de la encuesta (ej: 1)
          const coincidenciaT6 = encuestasValidas.find((e: any) => 
            String(e.idBase) === String(item.idp) && 
            String(e.esp) === String(item.esp)
          );

          if (coincidenciaT6) {
            const idPocKey = coincidenciaT6.idPocCompleto; // Usamos "1-1" como llave de grupo
            
            if (!acc[idPocKey]) {
              acc[idPocKey] = {
                idp: item.idp,
                idPocGenerado: idPocKey, // Aquí tienes el campo de T6 en tu TF
                espacioNombre: coincidenciaT6.nesp || item.esp,
                fotos: []
              };
            }

            acc[idPocKey].fotos.push({
              urlCompleta: `${URL_BASE}${item.path}`,
              categoria: coincidenciaT6.ncat || item.cat
            });
          }

          return acc;
        }, {});

        return Object.values(agrupado);
      })
    );
  }
}
