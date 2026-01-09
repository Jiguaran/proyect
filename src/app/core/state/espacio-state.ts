import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EspacioStateService {

  // 1. Para el ID seleccionado (lo que ya tenías)
  private espacioSubject = new BehaviorSubject<number | null>(null);
  espacio$ = this.espacioSubject.asObservable();

  // 2. NUEVO: El "almacén" para el array de objetos que quieres compartir
  private listaOpcionesSubject = new BehaviorSubject<any[]>([]);
  listaOpciones$ = this.listaOpcionesSubject.asObservable();

  // Emitir nuevo espacio (ID)
  setEspacio(espId: number | null) {
    this.espacioSubject.next(espId);
  }

  // 🚀 LA FUNCIÓN QUE TE FALTA: Para guardar la lista que viene de T6
  setListaCompartida(lista: any[]) {
    this.listaOpcionesSubject.next(lista);
  }

  // Limpiar todo
  clear() {
    this.espacioSubject.next(null);
    this.listaOpcionesSubject.next([]);
  }
}