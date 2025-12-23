import { Injectable } from '@angular/core';
import { Database } from '../models/supabase';
import { environment } from '../environments/environment';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BehaviorSubject, Observable, from, throwError,of } from 'rxjs';
import { map, tap, catchError,switchMap } from 'rxjs/operators';

import { CATALOGO_CAT } from '../core/constants/encuestas.constants';  //importamos el modelo de los datos a comparar, arrays

type Client = Database['public']['Tables']['t3_15221']['Row'];
// type ClientInsert = Database['public']['Tables']['t1_15221']['Insert']; // Para crear
// type ClientUpdate = Database['public']['Tables']['t1_15221']['Update']; // Para editar

@Injectable({
  providedIn: 'root',
})
export class T3 {
  
// 2. Definimos el servicio del cliente del Supabase con las operaciones CRUD básicas
  private supabase: SupabaseClient<Database> = createClient<Database>(
    environment.supabaseUrl,
    environment.supabaseKey
  );
  private readonly TABLE_NAME = 't3_15221'; // variable con el nombre de la tabla que estaré usando

  // Estado local del cliente
  private t3Subject = new BehaviorSubject<Client[]>([]); 
  public t3$ = this.t3Subject.asObservable();

  constructor() {}
  

  getAllT3(): Observable<Client[]> {
    const promise = this.supabase
      .from(this.TABLE_NAME)
      .select('*')  

    return from(promise).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data || [];
      }),
      tap(clients => {
        console.log('Datos T3 cargados:', clients);
        this.t3Subject  .next(clients);
      }),
      catchError(err => throwError(() => err))
    );
  }

getDatoT3(id: string, sufijo: string): Observable<any> {
  // 1. SEGURIDAD: Validar que el sufijo sea estrictamente numérico
  const esSufijoSeguro = /^\d+$/.test(sufijo);

  if (!esSufijoSeguro) {
    console.error('Sufijo inválido:', sufijo);
    return of({ data: [], error: 'Sufijo no permitido' });
  }

  const nombreTabla = `t3_${sufijo}`;

  // 2. CONSULTA ÚNICA A T3
  return from(
    this.supabase
      .from(nombreTabla as any)
      .select('*')
      .eq('idencuesta', id.trim())
  ).pipe(
    map(({ data, error }: any) => {
      if (error) {
        console.error('Error Supabase T3:', error);
        return { data: [], error };
      }

      if (!data || data.length === 0) return { data: [] };

      // 3. MAPEO CON CATALOGO_CAT
      const datosCombinados = data.map((row3: any) => {
        // En T3 el campo suele ser 'cat' (basado en tu código original)
        const nombreCat = CATALOGO_CAT[row3.cat];

        return {
          ...row3,
          // Si el ID no existe o es un string vacío, manejamos el fallback
          ncat: nombreCat && nombreCat !== '' ? nombreCat : `Cat. ${row3.cat} no definida`
        };
      });

      return { data: datosCombinados };
    })
  );
}

   


}