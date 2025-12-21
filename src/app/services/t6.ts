import { Injectable } from '@angular/core';
import { Database } from '../models/supabase';
import { environment } from '../environments/environment';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BehaviorSubject, Observable, from, throwError,of } from 'rxjs';
import { map, tap, catchError,switchMap } from 'rxjs/operators';

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
  const t6 = `t6_${sufijo}`;

  return from(
    this.supabase
      .from(t6 as any)
      .select('*')
      .eq('idencuesta', id.trim())
  );  
  }
}
