import { Injectable } from '@angular/core';
import { Database } from '../models/supabase';
import {environment } from '../environments/environment';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BehaviorSubject,Observable, from, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';


type Client = Database['public']['Tables']['tf_15221']['Row'];

@Injectable({
  providedIn: 'root',
})
export class Tf {
  private supabase: SupabaseClient<Database> = createClient<Database>(
    environment.supabaseUrl,
    environment.supabaseKey
  );

  private readonly TABLE_NAME = 'tf_15221'; // variable con el nombre de la tabla que estaré usando

  private tfSubject = new BehaviorSubject<Client[]>([]); 
  public tf$ = this.tfSubject.asObservable();

  constructor() {}
  
getFotosAgrupadas(id: string, sufijo: string): Observable<any[]> {
  const nombreTabla = `tf_${sufijo}`;
  const URL_BASE = `https://storage.googleapis.com/nutresa-7f30b.appspot.com/${sufijo}/img/`;

  return from(
    this.supabase
      .from(nombreTabla as any)
      .select('*')
      .eq('idencuesta', id.trim())
  ).pipe(
    map((response: any) => {
      // IMPORTANTE: Supabase devuelve { data, error, count... }
      // Si la consulta falló o no hay datos, devolvemos array vacío
      const rows = response.data || [];
      
      // Agrupamos por PATH (para no repetir fotos)
      const agrupado = rows.reduce((acc: any, item: any) => {
        if (!acc[item.path]) {
          acc[item.path] = {
            urlCompleta: `${URL_BASE}${item.path}`,
            espacio: item.esp,
            categorias: []
          };
        }
        if (!acc[item.path].categorias.includes(item.cat)) {
          acc[item.path].categorias.push(item.cat);
        }
        return acc;
      }, {});

      return Object.values(agrupado); // Esto devuelve un any[]
    })
  );
}
}
