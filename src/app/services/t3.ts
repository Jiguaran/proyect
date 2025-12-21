import { Injectable } from '@angular/core';
import { Database } from '../models/supabase';
import { environment } from '../environments/environment';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BehaviorSubject, Observable, from, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

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
  return from(
    this.supabase
      .from(nombreTabla as any)
      .select('*')
      .eq('idencuesta', id.trim())
  );
}

   


}