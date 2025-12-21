import { Component,ViewEncapsulation,OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api'; // Dejamos MessageService para mostrar errores de carga
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';

//importamos los servicios
import { T6 } from '../../../services/t6'; 
import { Database } from '../../../models/supabase';
import { T1 } from '../../../services/t1';

// Alias para el tipo de fila,
type T6Row = Database['public']['Tables']['t6_15221']['Row'];

@Component({
  selector: 'app-t6-getall',
  imports: [TableModule, CommonModule, ButtonModule, RouterModule, ToastModule, TagModule],
  templateUrl: './getall.html',
  styleUrl: './getall.css',
  encapsulation: ViewEncapsulation.None,
  providers: [MessageService] 
})
export class Getall implements OnInit {
  
  listaT6: T6Row[] = []
  Loading: boolean = false;
  datosT6: any = null;
  
  constructor(
    private t1Service: T1, // Lo usamos solo para ESCUCHAR el botón
    private t6Service: T6, // Tu servicio
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
// 1. Escuchamos al T1 (que es donde está el BehaviorSubject del formulario)
    this.t1Service.busqueda$.subscribe(res => {
      if (res.id && res.sufijo) {
        // 2. Cuando el botón se presiona, llamamos al SERVICIO T6
        this.cargarDatosT6(res.id, res.sufijo);
      }
    });
  }
  loadData(): void {
    this.Loading = true;
    
    this.t6Service.getAllT6().subscribe({
      next: (data) => {
        this.listaT6 = data;
        this.Loading = false;
      },
      error: (error) => {
        console.error('Error cargando datos T6:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error cargando datos T6'
        });
        this.Loading = false;
      }
    });
  }

  cargarDatosT6(id: string, sufijo: string) {
    this.Loading = true;
    this.t6Service.getDatoT6(id, sufijo).subscribe({
      next: (resultado: any) => {
        // Supabase devuelve un objeto. Los datos reales están en 'data'
        this.listaT6 = resultado.data || [];
        this.Loading = false;
      }
    });
  }
}
