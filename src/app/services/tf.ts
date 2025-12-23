import { Injectable } from '@angular/core';
import { Database } from '../models/supabase';
import {environment } from '../environments/environment';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BehaviorSubject,Observable, from, throwError, forkJoin,of } from 'rxjs';
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
  // 1. VALIDACIÓN ANT-INYECCIÓN: El sufijo debe ser estrictamente numérico
  const esSufijoSeguro = /^\d+$/.test(sufijo);
  if (!esSufijoSeguro) {
    console.error('Intento de inyección o sufijo inválido:', sufijo);
    return of([]); // Retorna un observable vacío de forma segura
  }

  // 2. LIMPIEZA DE ID: Aseguramos que el ID no tenga espacios maliciosos
  const idLimpio = id.trim();
  
  const nombreTabla = `tf_${sufijo}`;
  const tablaRelacion = `t6_${sufijo}`;
  const URL_BASE = `https://storage.googleapis.com/nutresa-7f30b.appspot.com/${sufijo}/img/`;

  return forkJoin({
    fotos: from(this.supabase.from(nombreTabla as any).select('*').eq('idencuesta', idLimpio)),
    encuesta: from(this.supabase.from(tablaRelacion as any).select('*').eq('idencuesta', idLimpio))
  }).pipe(
    map(({ fotos, encuesta }: any) => {
      // Manejo de errores de respuesta de Supabase
      if (fotos.error || encuesta.error) {
        console.error('Error en Supabase:', fotos.error || encuesta.error);
        return [];
      }

      const dataFotos = fotos.data || [];
      const dataEncuesta = encuesta.data || [];

      // 3. OPTIMIZACIÓN: Crear un Map para búsquedas O(1) en lugar de usar .find() dentro de .reduce()
      // Esto hace el código mucho más rápido si tienes muchos registros
      const encuestaMap = new Map();
      dataEncuesta.forEach((e: any) => {
        if (e.id === e.esp) { // Tu regla de oro
          const key = `${e.id}-${e.esp}`;
          encuestaMap.set(key, {
            ...e,
            idPocCompleto: key,
            idBase: String(e.id)
          });
        }
      });

      // 4. PROCESAMIENTO: Aplicar restricción cruzada
      const agrupado = dataFotos.reduce((acc: any, item: any) => {
        const keyBuscada = `${item.idp}-${item.esp}`;
        const coincidenciaT6 = encuestaMap.get(keyBuscada);

        // Validamos que el IDP coincida con la base (doble check de seguridad)
        if (coincidenciaT6 && String(coincidenciaT6.idBase) === String(item.idp)) {
          const idPocKey = coincidenciaT6.idPocCompleto;
          
          if (!acc[idPocKey]) {
            acc[idPocKey] = {
              idp: item.idp,
              idPocGenerado: idPocKey,
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
    }),
    catchError(err => {
      console.error('Error crítico en el flujo de fotos:', err);
      return of([]);
    })
  );
}
}
