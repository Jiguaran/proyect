import { Injectable } from '@angular/core';
import { Database } from '../models/supabase';
import { environment } from '../environments/environment';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CATALOGO_CAT, CATALOGO_ESP } from '../core/constants/encuestas.constants';

@Injectable({
  providedIn: 'root',
})
export class Tf {
  private supabase: SupabaseClient<Database> = createClient<Database>(
    environment.supabaseUrl,
    environment.supabaseKey
  );

  constructor() {}

  // Se añade espIdSeleccionado como tercer parámetro opcional
getFotosAgrupadas(id: string, sufijo: string, espIdSeleccionado?: string): Observable<any[]> {
  const esSufijoSeguro = /^\d+$/.test(sufijo);
  if (!esSufijoSeguro) return of([]);

  const nombreTabla = `tf_${sufijo}`;
  const URL_BASE = `https://storage.googleapis.com/nutresa-7f30b.appspot.com/${sufijo}/img/`;

  let query = this.supabase
    .from(nombreTabla as any)
    .select(`*`)
    .eq('idencuesta', id.trim());

  if (espIdSeleccionado) {
    query = query.eq('esp', espIdSeleccionado);
  }

  return from(query).pipe(
    map((response: any) => {
      const rows = response.data || [];

      // 1. Agrupación: Solo se crearán entradas para lo que existe en 'rows'
      const agrupadoPorEsp = rows.reduce((acc: any, item: any) => {
        const espKey = item.esp; // Usamos el ID tal cual
        
        // VALIDACIÓN: Si el ID de espacio no existe en el catálogo o es el ID 9 (vacío), 
        // podrías decidir si saltarlo o etiquetarlo como 'Otros'.
        const nombreEspacio = CATALOGO_ESP[espKey];
        if (!nombreEspacio || nombreEspacio.trim() === '') {
           return acc; // Ignora este registro si no tiene un nombre válido en el catálogo
        }

        const idPoc = item.idp || 'Sin ID';

        if (!acc[espKey]) {
          acc[espKey] = {
            nesp: nombreEspacio,
            espId: espKey,
            puntos: {} 
          };
        }

        if (!acc[espKey].puntos[idPoc]) {
          acc[espKey].puntos[idPoc] = {
            idp: idPoc,
            fotos: [],
            totalFotos: 0,
            fotosExistentes: 0
          };
        }

        // Solo agregamos si hay un path (foto real)
        if (item.path) {
          acc[espKey].puntos[idPoc].fotos.push({
            urlCompleta: `${URL_BASE}${item.path}`,
            path: item.path,
            ncat: CATALOGO_CAT[item.cat] || `Cat. ${item.cat}`,
            categoria: item.cat,
            observacion: item.obs,
            existe: true 
          });
        }

        return acc;
      }, {});

      // 2. Transformación a Array Final
      return Object.values(agrupadoPorEsp)
        .map((esp: any) => {
          const puntosArray = Object.values(esp.puntos)
            .map((poc: any) => ({
              ...poc,
              totalFotos: poc.fotos.length,
              fotosExistentes: poc.fotos.length,
              porcentaje: poc.fotos.length > 0 ? 100 : 0
            }))
            // VALIDACIÓN: Solo dejamos puntos que tengan fotos
            .filter((poc: any) => poc.totalFotos > 0);

          return { ...esp, puntos: puntosArray };
        })
        // VALIDACIÓN FINAL: Solo dejamos espacios que terminaron con puntos (y fotos)
        .filter((esp: any) => esp.puntos.length > 0);
    })
  );
}



}