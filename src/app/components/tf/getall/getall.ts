import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api'; 
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';


import { Tf } from '../../../services/tf'; 
import { T1 } from '../../../services/t1';

@Component({
  selector: 'app-tf-getall',
  standalone: true,
  imports: [CommonModule, ToastModule, DialogModule], // Añade DialogModule aquí
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
      },
      error: (err) => {
        console.error('Error en el componente:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las fotos'
        });
        this.Loading = false;
      }
    });
  }

  // Función para abrir el modal
abrirGaleria(poc: any) {
  this.pocSeleccionado = poc;
  this.displayGaleria = true;
}
}