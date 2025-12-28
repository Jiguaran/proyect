import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { MessageService } from 'primeng/api'; 
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ImageModule } from 'primeng/image';
import { ProgressBarModule } from 'primeng/progressbar';
import { CascadeSelectModule } from 'primeng/cascadeselect';

import { CATALOGO_ESP } from '../../../core/constants/encuestas.constants';



import { Tf } from '../../../services/tf'; 
import { T1 } from '../../../services/t1';

export interface Foto {
  urlCompleta: string;
  path: string;
  ncat: string;
  categoria: string;
  observacion: string;
  existe?: boolean;
  descargada?: boolean;
}

@Component({
  selector: 'app-tf-getall',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ToastModule, 
    DialogModule, 
    ImageModule, 
    ProgressBarModule, 
    CascadeSelectModule
  ],
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

  // Variables para el CascadeSelect
  opcionesEspacios: any[] = [];
  espacioSeleccionado: any = null;
  datosBusqueda: { id: string, sufijo: string } | null = null;

  opcionesFiltro: any[] = []; // Esta será la fuente de tu p-cascadeSelect

  constructor(
    private t1Service: T1, 
    private tfService: Tf, 
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    // 1. Preparar catálogo para el selector
    this.opcionesEspacios = Object.entries(CATALOGO_ESP)
      .filter(([key, value]) => value !== '')
      .map(([key, value]) => ({ name: value, code: key }));

    // 2. Valor por defecto (Primer espacio del catálogo)
    if (this.opcionesEspacios.length > 0) {
      this.espacioSeleccionado = this.opcionesEspacios[0];
    }

    // 3. Suscripción a la búsqueda inicial
    this.t1Service.busqueda$.subscribe(res => {
      if (res.id && res.sufijo) {
        this.datosBusqueda = res;
        this.cargarFotos();
      }else {
        this.datosBusqueda = null; // Si se limpia la búsqueda, ocultamos todo
      }
    });

  }

  // Carga principal con filtro

  cargarFotos() {
    if (!this.datosBusqueda) return;

    this.Loading = true;
    const { id, sufijo } = this.datosBusqueda;
    const espId = this.espacioSeleccionado?.code;

    this.tfService.getFotosAgrupadas(id, sufijo, espId).subscribe({
      next: (data: any[]) => {
        this.listaFotos = data; 
        this.Loading = false;
        // Lanzamos tu validación de existencia en Storage
        this.validarExistenciaGlobal();
      },
      error: (err) => {
        console.error('Error al cargar fotos:', err);
        this.Loading = false;
      }
    });
  }
  

  // Evento al cambiar el CascadeSelect
  onEspacioChange(event: any) {
    this.cargarFotos();
  }

  // --- TU LÓGICA DE VALIDACIÓN ---
  validarExistenciaGlobal() {
    this.listaFotos.forEach(espacio => {
      espacio.puntos.forEach((poc: any) => {
        this.validarExistencia(poc.fotos);
      });
    });
  }

  validarExistencia(fotos: Foto[]) {
    fotos.forEach((f: Foto) => {
      const img = new Image();
      img.onload = () => { f.existe = true; };
      img.onerror = () => { f.existe = false; };
      img.src = f.urlCompleta;
    });
  }

  contarFotosExistentes(fotos: Foto[]): number {
    if (!fotos) return 0;
    return fotos.filter((f: Foto) => f.existe !== false).length;
  }

  

  calcularPorcentaje(poc: any): number {
    if (!poc.fotos || poc.fotos.length === 0) return 0;
    const cargadas = this.contarFotosExistentes(poc.fotos);
    return Math.round((cargadas / poc.fotos.length) * 100);
  }

  abrirGaleria(poc: any) {
    // Usamos spread operator para asegurar que el objeto sea nuevo y el modal detecte el cambio
    this.pocSeleccionado = { ...poc };
    this.displayGaleria = true;
  }

  verImagenFull(url: string) {
    window.open(url, '_blank');
  }

  obtenerResumenEspacio() {
  let existentes = 0;
  let totales = 0;

  this.listaFotos.forEach(espacio => {
    espacio.puntos.forEach((poc: any) => {
      existentes += this.contarFotosExistentes(poc.fotos);
      totales += poc.totalFotos;
    });
  });

  return { existentes, totales };
}

//funcion para cargar solo lo que quiero



  
}