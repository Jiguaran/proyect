import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { T1 } from '../../services/t1';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-form',
  imports: [ReactiveFormsModule, CommonModule, ButtonModule, 
    InputTextModule],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class Form {
  miFormulario: FormGroup;
  
  constructor(private fb: FormBuilder,private t1Service: T1) {
    this.miFormulario = this.fb.group({
      Proyecto: ['', [Validators.required]],
      Idencuesta: ['', [Validators.required]],
    });

  }

  submit(): void {
  if (this.miFormulario.valid) {
    // 1. Extraemos los valores del formulario
    const { Idencuesta, Proyecto } = this.miFormulario.value;
    
    console.log('Buscando:', { Idencuesta, Proyecto });

    // 2. Notificamos al servicio para que todas las tablas se actualicen
    this.t1Service.notificarBusqueda(Idencuesta, Proyecto);

    } else {
    this.miFormulario.markAllAsTouched();
    
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.miFormulario.get(fieldName);
    if (field?.errors && field?.touched) {
      if (field.errors['required']) return `${fieldName} es requerido`;
    }
    return '';
  }
}
