import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api'; 
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ImageModule } from 'primeng/image';
import { ProgressBarModule } from 'primeng/progressbar'; // <--- IMPORTAR

import { Tf } from '../../../services/tf'; 
import { T1 } from '../../../services/t1';

export interface Foto {
  urlCompleta: string;
  path: string;
  ncat: string;
  categoria: string;
  observacion: string;
  existe?: boolean; // ? significa que puede no existir al principio
  descargada?: boolean;
}


@Component({
  selector: 'app-tf-getall',
  standalone: true,
  imports: [CommonModule, ToastModule, DialogModule,ImageModule, ProgressBarModule], // Añade DialogModule aquí
  templateUrl: './getall.html',
  styleUrl: './getall.css',
  encapsulation: ViewEncapsulation.None,
  providers: [MessageService]
})



export class Getall implements OnInit {

  
  listaFotos: any[] = [];
  Loading: boolean = false;
  
  // Variables para el Modal de fotos
displayGaleria: boolean = false;
pocSeleccionado: any = null;

  constructor(
    private t1Service: T1, 
    private tfService: Tf, 
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.t1Service.busqueda$.subscribe(res => {
      if (res.id && res.sufijo) {
        this.cargarFotos(res.id, res.sufijo);
      }
    });
  }

cargarFotos(id: string, sufijo: string) {
    this.Loading = true;
    this.tfService.getFotosAgrupadas(id, sufijo).subscribe({
      next: (data: any[]) => {
        this.listaFotos = data; 
        this.Loading = false;
        
        // Ejecutamos la validación en todas las fotos de golpe
        this.validarExistenciaGlobal();
      }
    });
  }

  // Esta función recorre toda tu estructura y lanza las validaciones
  validarExistenciaGlobal() {
    this.listaFotos.forEach(espacio => {
      espacio.puntos.forEach((poc: any) => {
        this.validarExistencia(poc.fotos);
      });
    });
  }

  // Tu función optimizada con el modelo Foto
  validarExistencia(fotos: Foto[]) {
    fotos.forEach((f: Foto) => {
      // IMPORTANTE: Al empezar, ya están en 'true' por el servicio,
      // pero aquí creamos el objeto Image para confirmar.
      const img = new Image();
      
      img.onload = () => {
        f.existe = true;
      };
      
      img.onerror = () => {
        f.existe = false; // Si falla, el contador del HTML bajará solo
      };

      img.src = f.urlCompleta;
    });
  }

  contarFotosExistentes(fotos: Foto[]): number {
    if (!fotos) return 0;
    // Filtramos las que no han fallado
    return fotos.filter((f: Foto) => f.existe !== false).length;
  }

  calcularPorcentaje(poc: any): number {
    if (!poc.fotos || poc.fotos.length === 0) return 0;
    const cargadas = this.contarFotosExistentes(poc.fotos);
    return Math.round((cargadas / poc.fotos.length) * 100);
  }

  abrirGaleria(poc: any) {
    this.pocSeleccionado = poc;
    this.displayGaleria = true;
  }

  verImagenFull(url: string) {
    window.open(url, '_blank');
  }
}
