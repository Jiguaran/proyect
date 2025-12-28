import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { FormsModule } from '@angular/forms'; 


import { CATALOGO_ESP } from '../../../core/constants/encuestas.constants';


import { T6 } from '../../../services/t6'; 
import { T1 } from '../../../services/t1';

@Component({
  selector: 'app-t6-getall',
  standalone: true,
  imports: [CommonModule, ButtonModule, ToastModule, TagModule,CascadeSelectModule,FormsModule],
  templateUrl: './getall.html',
  styleUrl: './getall.css',
  encapsulation: ViewEncapsulation.None,
  providers: [MessageService] 
})
export class Getall implements OnInit {
  
  listaT6: any[] = []; // Aquí guardaremos el array de especialidades
  Loading: boolean = false;
  //variables para el cascade select
    opcionesEspacios: any[] = [];
    espacioSeleccionado: any = null;
    datosBusqueda: { id: string, sufijo: string } | null = null;
    opcionesFiltro: any[] = []; // Esta será la fuente de tu p-cascadeSelect


  constructor(
    private t1Service: T1, 
    private t6Service: T6, 
    private messageService: MessageService
  ) {}

  ngOnInit(): void {

    this.opcionesEspacios = Object.entries(CATALOGO_ESP)
      .filter(([key, value]) => value !== '')
      .map(([key, value]) => ({ name: value, code: key }));

    // 2. Valor por defecto (Primer espacio del catálogo)
    if (this.opcionesEspacios.length > 0) {
      this.espacioSeleccionado = this.opcionesEspacios[0];
    }


this.t1Service.busqueda$.subscribe(res => {
  if (res && res.id && res.sufijo) {
    this.datosBusqueda = res;
    this.cargarDatosT6();
  } else {
    this.datosBusqueda = null;
    this.listaT6 = [];
  }
});

  }
  
onEspacioChange(event: any) {
  this.cargarDatosT6();
}



cargarDatosT6() {
  if (!this.datosBusqueda) return;

  this.Loading = true;
  this.listaT6 = [];

  const { id, sufijo } = this.datosBusqueda;
  const espId = this.espacioSeleccionado?.code;

  this.t6Service.getDatoT6(id, sufijo, espId).subscribe({
    next: (resultado: any) => {
      this.listaT6 = resultado.data || [];
      this.Loading = false;

      if (this.listaT6.length === 0) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Sin datos',
          detail: 'No se encontraron registros para esta búsqueda'
        });
      }
    },
    error: () => {
      this.Loading = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al conectar con el servidor'
      });
    }
  });
}

}