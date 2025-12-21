import { Component,ViewEncapsulation,OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api'; // Dejamos MessageService para mostrar errores de carga
import { ToastModule } from 'primeng/toast';

//importamos los servicios
import { T3 } from '../../../services/t3'; 
import { Database } from '../../../models/supabase';
import { T1 } from '../../../services/t1';


// Alias para el tipo de fila,
type T3Row = Database['public']['Tables']['t3_15221']['Row'];

@Component({
  selector: 'app-t3-getall',
  standalone: true,
  imports: [TableModule, CommonModule, ButtonModule, RouterModule, ToastModule],
  templateUrl: './getall.html',
  styleUrl: './getall.css',
  encapsulation: ViewEncapsulation.None,
  providers: [MessageService] 
})
export class Getall implements OnInit {

  listaT3: T3Row[] = []; 
  loading: boolean = false;
  datosT3: any = null;

  constructor(
    private t1Service: T1, // Lo usamos solo para ESCUCHAR el botón
    private t3Service: T3, // Tu servicio
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
// 1. Escuchamos al T1 (que es donde está el BehaviorSubject del formulario)
    this.t1Service.busqueda$.subscribe(res => {
      if (res.id && res.sufijo) {
        // 2. Cuando el botón se presiona, llamamos al SERVICIO T2
        this.cargarDatosT3(res.id, res.sufijo);
      }
    });
  }


  loadData(): void {
    this.loading = true;
    
    this.t3Service.getAllT3().subscribe({
      next: (data) => {
        this.listaT3 = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando datos T3:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar los datos de la tabla T3'
        });
        this.loading = false;
      }
    });
  }

  cargarDatosT3(id: string, sufijo: string) {
  this.loading = true;
  this.t3Service.getDatoT3(id, sufijo).subscribe({
    next: (resultado: any) => {
      // Como ya no usamos .single(), resultado.data YA ES un array
      this.listaT3 = resultado.data || []; 
      this.loading = false;
    }
  });
}
}