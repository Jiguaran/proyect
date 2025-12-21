import { Injectable } from '@angular/core';
import { Database } from '../models/supabase';
import { environment } from '../environments/environment';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BehaviorSubject, Observable, from, throwError,of } from 'rxjs';
import { map, tap, catchError,switchMap } from 'rxjs/operators';

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
  const nombreTabla = `t3_${sufijo}`;
  const t6 = `t6_${sufijo}`;
  return from(
    this.supabase
      .from(nombreTabla as any)
      .select('*')
      .eq('idencuesta', id.trim())
  ).pipe(
      switchMap(({ data: dataT3, error }: any) => {
        if (error || !dataT3 || dataT3.length === 0) return of({ data: [] });

        // Obtenemos los 'esp' únicos para buscar sus nombres en T6
        const idsCat = [...new Set(dataT3.map((item: any) => item.esp))];
        return from(
          this.supabase
            .from(t6 as any)
            .select('cat, ncat')
            .in('cat', idsCat)
        ).pipe(
          map(({ data: dataT6 }: any) => {
            // Unimos los datos: a cada fila de T2 le inyectamos su 'ncat'
            const datosCombinados = dataT3.map((row3: any) => {
              const match = dataT6?.find((row6: any) => row6.cat === row3.cat);
              return {
                ...row3,
                ncat: match ? match.ncat : 'No definido' // Nombre plano
              };
            });
            return { data: datosCombinados };
          })
        );
      })
    );
}

   


}