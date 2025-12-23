import { Injectable } from '@angular/core';
import { Database } from '../models/supabase';
import { environment } from '../environments/environment';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BehaviorSubject, Observable, from, throwError,of } from 'rxjs';
import { map, tap, catchError  } from 'rxjs/operators';

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
getDatoT6(id: string, sufijo: string): Observable<any> {
  const esSufijoSeguro = /^\d+$/.test(sufijo);

  if (!esSufijoSeguro) {
    return of({ data: [], error: 'Sufijo no permitido' });
  }

  const nombreTabla = `t6_${sufijo}`;

  return from(
    this.supabase
      .from(nombreTabla as any)
      .select('*')
      .eq('idencuesta', id.trim())
  ).pipe(
    map(({ data, error }: any) => {
      if (error) throw error;
      if (!data || data.length === 0) return { data: [] };

      // 1. Filtrar primero: Solo donde id y esp son iguales
      // 2. Agrupar para eliminar duplicados de IDPOC
      const filtradoYAgrupado = data
        .filter((fila: any) => fila.id === fila.esp) // Regla de oro: id == esp
        .reduce((acc: any, fila: any) => {
          const idPoc = `${fila.id}-${fila.esp}`;

          if (!acc[idPoc]) {
            acc[idPoc] = {
              ...fila,
              idpoc: idPoc // Inyectamos el campo dinámico
            };
          }
          // No sumamos nada, si hay repetidos se queda con el primero que encuentre
          return acc;
        }, {});

      return { data: Object.values(filtradoYAgrupado) };
    })
  );
}
}
