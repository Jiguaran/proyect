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
  const tablaRelacion = `t6_${sufijo}`;
  const URL_BASE = `https://storage.googleapis.com/nutresa-7f30b.appspot.com/${sufijo}/img/`;

  return from(
    this.supabase
      .from(nombreTabla as any)
      .select(`*`) // Traemos todo de TF primero para asegurar que no de 0
      .eq('idencuesta', id.trim())
  ).pipe(
    map((response: any) => {
      const rows = response.data || [];
      
      // Agrupamos por IDP (Punto de contacto)
      const agrupado = rows.reduce((acc: any, item: any) => {
        const idPoc = item.idp;
        
        // Si el IDP es nulo o vacío, no lo saltamos si quieres ser estricto, 
        // pero aquí lo agruparemos
        if (!acc[idPoc]) {
          acc[idPoc] = {
            idp: idPoc,
            espacio: item.esp, // Usamos el valor que ya viene en la tabla
            fotos: []
          };
        }

        acc[idPoc].fotos.push({
          urlCompleta: `${URL_BASE}${item.path}`,
          categoria: item.cat
        });

        return acc;
      }, {});

      return Object.values(agrupado);
    })
  );
}
}