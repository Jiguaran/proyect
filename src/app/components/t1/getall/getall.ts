import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api'; // Dejamos MessageService para mostrar errores de carga
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext'; //importamos inputText Para poder crear la barra de busqueda para iiltrar nuestro user
import { from, Observable } from 'rxjs'; // 1. Importa 'from'
 

// Importar servicios
import { T1 } from '../../../services/t1'; 
import { Database } from '../../../models/supabase';

// Alias para el tipo de fila,
type T1Row = Database['public']['Tables']['t1_15221']['Row'];

@Component({
  selector: 'app-t1-getall',
  // Quitamos ConfirmDialogModule de los imports
  standalone: true,
  imports: [TableModule, CommonModule, ButtonModule, RouterModule, ToastModule,InputTextModule], 
  templateUrl: './getall.html',
  styleUrl: './getall.css',
  encapsulation: ViewEncapsulation.None,
  // Quitamos ConfirmationService de los providers
  providers: [MessageService] 
})

export class Getall implements OnInit {
  
  listaT1: T1Row[] = []; 
  loading: boolean = false;

  constructor(
    private t1Service: T1, // servicio
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
// 1. Te suscribes al canal de "busqueda$" del servicio
  this.t1Service.busqueda$.subscribe(params => {
    
    // 2. Si llegan datos válidos...
    if (params.id && params.sufijo) {
      console.log('Soy una tabla y acabo de recibir el aviso:', params);
      
      // 3. Ejecutas TU propia búsqueda en Supabase
      this.cargarDatos(params.id, params.sufijo);
    }
  });
  }
  
cargarDatos(id: string, sufijo: string) {
  this.loading = true;
  
  // PRIMERO: Limpiamos la lista a mostrar
  this.listaT1 = []; 

  this.t1Service.getDatoPorTabla(id, sufijo).subscribe({
    next: (resultado: any) => {
      // 2. Solo si Supabase encontró el registro, lo agregamos
      if (resultado.data) {
        // Como T1 es cabecera, guardamos el objeto único dentro del array
        this.listaT1 = [resultado.data]; 
      } else {
        // Si resultado.data es null (encuesta nueva), listaT1 se queda vacía []
        this.listaT1 = [];
      }
      this.loading = false;
    },
    error: (err) => {
      console.error('Error:', err);
      this.listaT1 = []; // También limpiamos en caso de error
      this.loading = false;
    }
  });
}

  loadData(): void {
    this.loading = true;
    this.listaT1 = [];
    this.t1Service.getAllT1().subscribe({
      next: (data) => {
        this.listaT1 = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando datos T1:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar los datos de la tabla T1'
        });
        this.loading = false;
      }
    });
  }



  
}