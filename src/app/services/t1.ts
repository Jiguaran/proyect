  import { Injectable } from '@angular/core';
  import { Database } from '../models/supabase';
  import { environment } from '../environments/environment';
  import { createClient, SupabaseClient } from '@supabase/supabase-js';
  import { BehaviorSubject, Observable, from, throwError } from 'rxjs';
  import { map, tap, catchError } from 'rxjs/operators';




  type Client = Database['public']['Tables']['t1_15221']['Row'];
  // type ClientInsert = Database['public']['Tables']['t1_15221']['Insert']; // Para crear
  // type ClientUpdate = Database['public']['Tables']['t1_15221']['Update']; // Para editar

  @Injectable({
    providedIn: 'root',
  })

  export class T1 {
    // 2. Definimos el servicio del cliente del Supabase con las operaciones CRUD básicas
    private supabase: SupabaseClient<Database> = createClient<Database>(
      environment.supabaseUrl,
      environment.supabaseKey
    );

    private busquedaSource = new BehaviorSubject<{id: string, sufijo: string}>({id: '', sufijo: ''});
    busqueda$ = this.busquedaSource.asObservable();


    private readonly TABLE_NAME = 't1_15221'; // variable con el nombre de la tabla que estaré usando

    // Estado local del cliente
    private t1Subject = new BehaviorSubject<Client[]>([]); 
    public t1$ = this.t1Subject.asObservable();

    constructor() {}
    

    getAllT1(): Observable<Client[]> {
      const promise = this.supabase
        .from(this.TABLE_NAME)
        .select('*')  
        .order('cliente_n', { ascending: true }); // Ordenar por nombre, por ejemplo

      return from(promise).pipe(
        map(({ data, error }) => {
          if (error) throw error;
          return data || [];
        }),
        tap(clients => {
          console.log('Datos T1 cargados:', clients);
          this.t1Subject  .next(clients);
        }),
        catchError(err => throwError(() => err))
      );
    }



  getDatoPorTabla(id: string, sufijo: string): Observable<any> {
    const nombreTabla = `t1_${sufijo}`; 
    
    // Convertimos la promesa en Observable para que el .subscribe funcione en el componente
    return from(
      this.supabase
        .from(nombreTabla as any)
        .select('*')
        .eq('idencuesta', id)
        .single()
    );
  }

    // Función para disparar la búsqueda desde el formulario
    notificarBusqueda(id: string, sufijo: string) {
      this.busquedaSource.next({ id, sufijo });
    }

    
  }