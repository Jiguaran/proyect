import { Injectable } from '@angular/core';
import { Database } from '../models/supabase';
import { environment } from '../environments/environment';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BehaviorSubject, Observable, from, throwError,of } from 'rxjs';
import { map, tap, catchError,switchMap } from 'rxjs/operators';

import { CATALOGO_ESP } from '../core/constants/encuestas.constants';  //importamos el modelo de los datos a comparar, arrays

type Client = Database['public']['Tables']['t2_15221']['Row'];
// type ClientInsert = Database['public']['Tables']['t1_15221']['Insert']; // Para crear
// type ClientUpdate = Database['public']['Tables']['t1_15221']['Update']; // Para editar

@Injectable({
  providedIn: 'root',
})
export class T2 {
 // 2. Definimos el servicio del cliente del Supabase con las operaciones CRUD básicas
  private supabase: SupabaseClient<Database> = createClient<Database>(
    environment.supabaseUrl,
    environment.supabaseKey
  );
  private readonly TABLE_NAME = 't2_15221'; // variable con el nombre de la tabla que estaré usando

  // Estado local del cliente
  private t2Subject = new BehaviorSubject<Client[]>([]); 
  public t2$ = this.t2Subject.asObservable();

  constructor() {}
  

  getAllT2(): Observable<Client[]> {
    const promise = this.supabase
      .from(this.TABLE_NAME)
      .select('*')  

    return from(promise).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data || [];
      }),
      tap(clients => {
        console.log('Datos T2 cargados:', clients);
        this.t2Subject  .next(clients);
      }),
      catchError(err => throwError(() => err))
    );
  }

getDatoT2(id: string, sufijo: string): Observable<any> {
  // 1. SEGURIDAD: Validar que el sufijo sea estrictamente numérico
  const esSufijoSeguro = /^\d+$/.test(sufijo);

  if (!esSufijoSeguro) {
    console.error('Sufijo inválido detectado');
    return of({ data: [], error: 'Sufijo no permitido' });
  }

  const nombreTabla = `t2_${sufijo}`;

  // 2. CONSULTA ÚNICA: Solo vamos a la tabla T2
  return from(
    this.supabase
      .from(nombreTabla as any)
      .select('*')
      .eq('idencuesta', id.trim())
  ).pipe(
    map(({ data, error }: any) => {
      if (error) {
        console.error('Error en Supabase:', error);
        return { data: [], error };
      }

      if (!data || data.length === 0) return { data: [] };

      // 3. TRANSFORMACIÓN LOCAL: Inyectamos el 'nesp' desde el CATALOGO_ESP
      const datosCombinados = data.map((row2: any) => {
        // Buscamos el nombre en el catálogo usando el ID 'esp'
        const nombreEsp = CATALOGO_ESP[row2.esp];

        return {
          ...row2,
          // Si el nombre es un string vacío o no existe, ponemos 'No definido'
          nesp: nombreEsp && nombreEsp !== '' ? nombreEsp : `ID ${row2.esp} no definido`
        };
      });

      return { data: datosCombinados };
    })
  );
}


}