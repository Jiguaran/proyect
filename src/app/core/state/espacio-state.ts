import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root' // 👈 GLOBAL, UNA SOLA INSTANCIA
})
export class EspacioStateService {

  // null = ningún espacio seleccionado
  private espacioSubject = new BehaviorSubject<number | null>(null);

  // Observable público (solo lectura)
  espacio$ = this.espacioSubject.asObservable();

  // Emitir nuevo espacio
  setEspacio(espId: number | null) {
    this.espacioSubject.next(espId);
  }

  // Limpiar selección
  clear() {
    this.espacioSubject.next(null);
  }
}
