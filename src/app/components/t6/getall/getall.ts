import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';

import { T6 } from '../../../services/t6'; 
import { T1 } from '../../../services/t1';

@Component({
  selector: 'app-t6-getall',
  standalone: true,
  imports: [CommonModule, ButtonModule, ToastModule, TagModule],
  templateUrl: './getall.html',
  styleUrl: './getall.css',
  encapsulation: ViewEncapsulation.None,
  providers: [MessageService] 
})
export class Getall implements OnInit {
  
  listaT6: any[] = []; // Aquí guardaremos el array de especialidades
  Loading: boolean = false;
  
  constructor(
    private t1Service: T1, 
    private t6Service: T6, 
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.t1Service.busqueda$.subscribe(res => {
      if (res && res.id && res.sufijo) {
        this.cargarDatosT6(res.id, res.sufijo);
      }
    });
  }

  cargarDatosT6(id: string, sufijo: string) {
    this.Loading = true;
    this.listaT6 = [];

    this.t6Service.getDatoT6(id, sufijo).subscribe({
      next: (resultado: any) => {
        // Tu servicio devuelve: { data: [ { titulo, espId, puntos: [...] } ] }
        this.listaT6 = resultado.data || [];
        this.Loading = false;
        
        if (this.listaT6.length === 0) {
          this.messageService.add({ severity: 'warn', summary: 'Sin datos', detail: 'No se encontraron registros para esta búsqueda' });
        }
      },
      error: (err) => {
        console.error('Error en T6:', err);
        this.Loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al conectar con el servidor' });
      }
    });
  }
}