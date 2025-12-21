import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api'; 
import { ToastModule } from 'primeng/toast';

// Servicios
import { Tf } from '../../../services/tf'; // Crea este servicio o añade el método al tuyo
import { T1 } from '../../../services/t1';

@Component({
  selector: 'app-tf-getall',
  standalone: true,
  imports: [CommonModule, ToastModule],
  templateUrl: './getall.html',
  styleUrl: './getall.css',
  encapsulation: ViewEncapsulation.None,
  providers: [MessageService]
})
export class Getall {
  listaFotos: any[] = [];
  Loading: boolean = false;
  
  constructor(
    private t1Service: T1, 
    private tfService: Tf, 
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    // Escuchamos al T1 para saber cuándo buscar
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
      // 'data' aquí ya es el resultado de Object.values(agrupado)
      this.listaFotos = data; 
      this.Loading = false;
      console.log('Fotos cargadas:', this.listaFotos);
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
}
