import { Injectable } from '@angular/core';
import { Database } from '../models/supabase';
import {environment } from '../environments/environment';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BehaviorSubject,Observable, from, throwError,of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';


import { CATALOGO_CAT,CATALOGO_ESP } from '../core/constants/encuestas.constants';  //importamos el modelo de los datos a comparar, arrays

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
  // 1. VALIDACIÓN DE SEGURIDAD (Agregar aquí)
  const esSufijoSeguro = /^\d+$/.test(sufijo);
  if (!esSufijoSeguro) {
    console.warn('Sufijo no permitido para fotos:', sufijo);
    return of([]); // Retorna un observable vacío inmediatamente
  }

  // 2. DEFINICIÓN DE VARIABLES
  const nombreTabla = `tf_${sufijo}`;
  const URL_BASE = `https://storage.googleapis.com/nutresa-7f30b.appspot.com/${sufijo}/img/`;

  // 3. CONSULTA Y TRANSFORMACIÓN
  return from(
    this.supabase
      .from(nombreTabla as any)
      .select(`*`)
      .eq('idencuesta', id.trim())
  ).pipe(map((response: any) => {
  const rows = response.data || [];
  
  const agrupadoPorEsp = rows.reduce((acc: any, item: any) => {
    const espKey = item.esp || '0';
    const idPoc = item.idp || 'Sin ID';

    // 1. Si no existe el Espacio, lo creamos
    if (!acc[espKey]) {
      acc[espKey] = {
        nesp: CATALOGO_ESP[espKey] || `Espacio ${espKey}`,
        espId: espKey,
        puntos: {} // Usamos objeto para agrupar puntos únicos
      };
    }

    // 2. Si no existe el Punto dentro de ese espacio, lo creamos
    if (!acc[espKey].puntos[idPoc]) {
      acc[espKey].puntos[idPoc] = {
        idp: idPoc,
        fotos: []
      };
    }

    // 3. Agregamos la foto al punto
    acc[espKey].puntos[idPoc].fotos.push({
      urlCompleta: `${URL_BASE}${item.path}`,
      path: item.path, // <--- ESTA LÍNEA TE FALTA
      ncat: CATALOGO_CAT[item.cat] || `Cat. ${item.cat}`,
      categoria: item.cat,
      observacion: item.obs // (Opcional, por si quieres mostrar 'obs' después)
    });

    return acc;
  }, {});

  // Convertimos los objetos a arrays para el *ngFor
  return Object.values(agrupadoPorEsp).map((esp: any) => ({
    ...esp,
    puntos: Object.values(esp.puntos)
  }));
}))
  
}


}