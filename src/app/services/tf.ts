import { Injectable } from '@angular/core';
import { Database } from '../models/supabase';
import { environment } from '../environments/environment';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { CATALOGO_CAT, CATALOGO_ESP } from '../core/constants/encuestas.constants';

type Client = Database['public']['Tables']['tf_15221']['Row'];

@Injectable({
  providedIn: 'root',
})
export class Tf {
  private supabase: SupabaseClient<Database> = createClient<Database>(
    environment.supabaseUrl,
    environment.supabaseKey
  );

  private tfSubject = new BehaviorSubject<Client[]>([]);
  public tf$ = this.tfSubject.asObservable();

  constructor() {}

  getFotosAgrupadas(id: string, sufijo: string): Observable<any[]> {
    // 1. VALIDACIÓN DE SEGURIDAD
    const esSufijoSeguro = /^\d+$/.test(sufijo);
    if (!esSufijoSeguro) {
      console.warn('Sufijo no permitido para fotos:', sufijo);
      return of([]);
    }

    // 2. DEFINICIÓN DE VARIABLES
    const nombreTabla = `tf_${sufijo}`;
    const URL_BASE = `https://storage.googleapis.com/nutresa-7f30b.appspot.com/${sufijo}/img/`;

    // 3. CONSULTA Y TRANSFORMACIÓN
    return from(
      this.supabase
        .from(nombreTabla as any)
        .select(`*`)
        .eq('idencuesta', id.trim())
    ).pipe(
      map((response: any) => {
        const rows = response.data || [];

        // REDUCE: Agrupamos la data por Espacio y Punto de Contacto
        const agrupadoPorEsp = rows.reduce((acc: any, item: any) => {
          const espKey = item.esp || '0';
          const idPoc = item.idp || 'Sin ID';

          // Crear Espacio si no existe
          if (!acc[espKey]) {
            acc[espKey] = {
              nesp: CATALOGO_ESP[espKey] || `Espacio ${espKey}`,
              espId: espKey,
              puntos: {} 
            };
          }

          // Crear Punto si no existe
          if (!acc[espKey].puntos[idPoc]) {
            acc[espKey].puntos[idPoc] = {
              idp: idPoc,
              fotos: [],
              totalFotos: 0,
              fotosExistentes: 0
            };
          }

          // Agregar la foto al punto (Asumiendo 'existe: true' por defecto de DB)
          acc[espKey].puntos[idPoc].fotos.push({
            urlCompleta: `${URL_BASE}${item.path}`,
            path: item.path,
            ncat: CATALOGO_CAT[item.cat] || `Cat. ${item.cat}`,
            categoria: item.cat,
            observacion: item.obs,
            existe: true // Marcamos como existente inicialmente
          });

          // Actualizamos los contadores del Punto de Contacto
          acc[espKey].puntos[idPoc].totalFotos = acc[espKey].puntos[idPoc].fotos.length;
          acc[espKey].puntos[idPoc].fotosExistentes = acc[espKey].puntos[idPoc].fotos.length;

          return acc;
        }, {});

        // MAP FINAL: Convertimos objetos a arrays y calculamos porcentaje
        return Object.values(agrupadoPorEsp).map((esp: any) => ({
          ...esp,
          puntos: Object.values(esp.puntos).map((poc: any) => ({
            ...poc,
            // Pre-calculamos el porcentaje para que la barra de progreso sea instantánea
            porcentaje: poc.totalFotos > 0 
              ? Math.round((poc.fotosExistentes / poc.totalFotos) * 100) 
              : 0
          }))
        }));
      })
    );
  }
}