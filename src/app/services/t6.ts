import { Injectable } from '@angular/core';
import { Database } from '../models/supabase';
import { environment } from '../environments/environment';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BehaviorSubject, Observable, from, throwError,of } from 'rxjs';
import { map, tap, catchError  } from 'rxjs/operators';

import { CATALOGO_CAT,CATALOGO_ESP } from '../core/constants/encuestas.constants';  //importamos el modelo de los datos a comparar, arrays
type Client = Database['public']['Tables']['t6_15221']['Row'];

@Injectable({
  providedIn: 'root',
})
export class T6 {
// 2. Definimos el servicio del cliente del Supabase con las operaciones CRUD básicas
  private supabase: SupabaseClient<Database> = createClient<Database>(
    environment.supabaseUrl,
    environment.supabaseKey
  );

  private readonly TABLE_NAME = 't6_15221'; // variable con el nombre de la tabla que estaré usando

  // Estado local del cliente
  private t6Subject = new BehaviorSubject<Client[]>([]); 
  public t6$ = this.t6Subject.asObservable();
  
  constructor() {}
  getAllT6(): Observable<Client[]> {
    const promise = this.supabase
      .from(this.TABLE_NAME)
      .select('*')  

    return from(promise).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data || [];
      }),
      tap(clients => {
        console.log('Datos T6 cargados:', clients);
        this.t6Subject  .next(clients);
      }),
      catchError(err => throwError(() => err))
    );
  } 
  
getDatoT6(
  id: string,
  sufijo: string,
  espIdSeleccionado?: string
): Observable<any> {

  // 🔒 MISMA validación que el servicio que sí funciona
  const esSufijoSeguro = /^\d+$/.test(sufijo);
  if (!esSufijoSeguro) return of({ data: [] });

  const nombreTabla = `t6_${sufijo}`;

  let query = this.supabase
    .from(nombreTabla as any)
    .select('*')
    .eq('idencuesta', id.trim());

  // ✅ ESTE ERA EL FILTRO QUE FALTABA
if (espIdSeleccionado) {
  query = query.eq('esp', Number(espIdSeleccionado));
}

  return from(query).pipe(
    map(({ data, error }: any) => {
      if (error) throw error;
      if (!data || data.length === 0) return { data: [] };

      const agrupado = data.reduce((acc: any, fila: any) => {
        const espKey = fila.esp;
        const nombreEsp = CATALOGO_ESP[espKey] || `Esp. ${espKey}`;
        const idPoc = `${fila.esp}-${fila.id}`;

        if (!acc[espKey]) {
          acc[espKey] = { titulo: nombreEsp, puntos: {} };
        }

        if (!acc[espKey].puntos[idPoc]) {
          acc[espKey].puntos[idPoc] = {
            idpoc: idPoc,
            numId: fila.id,
            detalles: []
          };
        }

        acc[espKey].puntos[idPoc].detalles.push({
          ...fila,
          ncat: fila.ncat || CATALOGO_CAT[fila.cat] || `Cat. ${fila.cat}`
        });

        return acc;
      }, {});

      const resultadoFinal = Object.values(agrupado).map((esp: any) => {
        const puntosArray = Object.values(esp.puntos)
          .sort((a: any, b: any) => Number(a.numId) - Number(b.numId));
        return { ...esp, puntos: puntosArray };
      });

      return { data: resultadoFinal };
    })
  );
}



}
