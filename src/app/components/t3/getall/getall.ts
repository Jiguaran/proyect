import { Component,ViewEncapsulation,OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api'; // Dejamos MessageService para mostrar errores de carga
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { CascadeSelect } from 'primeng/cascadeselect';
import { FormsModule } from '@angular/forms';


//importamos los servicios
import { T3 } from '../../../services/t3'; 
import { Database } from '../../../models/supabase';
import { T1 } from '../../../services/t1';
import { EspacioStateService } from '../../../core/state/espacio-state';


// Alias para el tipo de fila,
type T3Row = Database['public']['Tables']['t3_15221']['Row'];
type T3WitNcat = T3Row & { ncat?: string };

@Component({
  selector: 'app-t3-getall',
  standalone: true,
  imports: [TableModule, CommonModule, ButtonModule, RouterModule, ToastModule, TagModule, CascadeSelect,FormsModule],
  templateUrl: './getall.html',
  styleUrl: './getall.css',
  encapsulation: ViewEncapsulation.None,
  providers: [MessageService] 
})
export class Getall implements OnInit {

  listaT3: T3WitNcat[] = []; 
  loading: boolean = false;
  datosT3: any = null;


  opcionesEspacios: any[] = [];
  espacioSeleccionado: number | null = null;
  listaT3Original: T3WitNcat[] = []; // respaldo


  constructor(
    private espacioState: EspacioStateService,
    private t1Service: T1, // Lo usamos solo para ESCUCHAR el botón
    private t3Service: T3, // Mi servicio
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
        // 1. Escuchamos al T1 (que es donde está el BehaviorSubject del formulario)
    this.t1Service.busqueda$.subscribe(res => {
      if (res.id && res.sufijo) {
        // 2. Cuando el botón se presiona, llamamos al SERVICIO 3
        this.cargarDatosT3(res.id, res.sufijo);
      }
    });



  }


onEspacioChange(event: any) {
  // PrimeNG CascadeSelect devuelve el valor seleccionado en event.value
  // Si el usuario borra la selección, event.value puede ser null
  const seleccionado = event.value;
  
  // Extraemos el ID dependiendo de si el Select devuelve el objeto o solo el valor
  const espId = seleccionado?.espId !== undefined ? seleccionado.espId : seleccionado;

  this.espacioSeleccionado = espId;

  if (espId === null || espId === undefined) {
    this.listaT3 = [...this.listaT3Original];
    this.espacioState.clear();
  } else {
    this.espacioState.setEspacio(espId);
    // Filtrado comparando tipos consistentes
    this.listaT3 = this.listaT3Original.filter(item => item.esp === espId);
  }
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

      this.listaT3Original = resultado.data || [];
      this.listaT3 = [...this.listaT3Original];

      // 🔑 ESPACIOS PARA EL SELECT
      this.opcionesEspacios = resultado.espacios || [];

      // Limpiamos selección anterior
      this.espacioSeleccionado = null;
      this.espacioState.clear();

      this.loading = false;
    },
    error: () => this.loading = false
  });
}


}