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

      const agrupadoPorEsp = rows.reduce((acc: any, item: any) => {
        const espKey = item.esp;
        const nombreEspacio = CATALOGO_ESP[espKey];
        
        if (!nombreEspacio || nombreEspacio.trim() === '') {
           return acc; 
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

      return Object.values(agrupadoPorEsp)
        .map((esp: any) => {
          const puntosArray = Object.values(esp.puntos)
            .map((poc: any) => {
              
              // --- AQUÍ ESTÁ LA MAGIA PARA LAS CATEGORÍAS ÚNICAS ---
              // Extraemos solo los nombres de categorías de las fotos y eliminamos duplicados
              const catsVistas = new Set();
              const categoriasUnicas = poc.fotos
                .map((f: any) => f.ncat)
                .filter((ncat: string) => {
                  if (!catsVistas.has(ncat)) {
                    catsVistas.add(ncat);
                    return true;
                  }
                  return false;
                });

              return {
                ...poc,
                categoriasUnicas, // 👈 Nueva propiedad limpia
                totalFotos: poc.fotos.length,
                fotosExistentes: poc.fotos.length,
                porcentaje: poc.fotos.length > 0 ? 100 : 0
              };
            })
            .filter((poc: any) => poc.totalFotos > 0);

          return { ...esp, puntos: puntosArray };
        })
        .filter((esp: any) => esp.puntos.length > 0);
    })
  );
}



}