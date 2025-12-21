import { Component,ViewEncapsulation,OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api'; // Dejamos MessageService para mostrar errores de carga
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
// Importar servicios
import { T2 } from '../../../services/t2'; 
import { Database } from '../../../models/supabase';
import { T1 } from '../../../services/t1';

// Alias para el tipo de fila,
type T2Row = Database['public']['Tables']['t2_15221']['Row'];
type T2WitNesp = T2Row & { nesp?: string };

@Component({
  selector: 'app-t2-getall',
  standalone : true,
  imports: [TableModule, CommonModule, ButtonModule, RouterModule, ToastModule, TagModule], 
  templateUrl: './getall.html',
  styleUrl: './getall.css',
  encapsulation: ViewEncapsulation.None,
  providers: [MessageService] 
})
export class Getall implements OnInit {
  listaT2: T2WitNesp[] = []; 
  loading: boolean = false;
  datosT2: any = null;

  constructor(
    private t1Service: T1, // Lo usamos solo para ESCUCHAR el botón
    private t2Service: T2, // Tu servicio
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
// 1. Escuchamos al T1 (que es donde está el BehaviorSubject del formulario)
    this.t1Service.busqueda$.subscribe(res => {
      if (res.id && res.sufijo) {
        // 2. Cuando el botón se presiona, llamamos al SERVICIO T2
        this.cargarDatosT2(res.id, res.sufijo);
      }
    });
  }


  loadData(): void {
    this.loading = true;
    
    this.t2Service.getAllT2().subscribe({
      next: (data) => {
        this.listaT2 = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando datos T2:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar los datos de la tabla T2'
        });
        this.loading = false;
      }
    });
  }

cargarDatosT2(id: string, sufijo: string) {
  this.loading = true;
  this.t2Service.getDatoT2(id, sufijo).subscribe({
    next: (resultado: any) => {
      // Como ya no usamos .single(), resultado.data YA ES un array
      this.listaT2 = resultado.data || []; 
      this.loading = false;
    }
  });
}



}