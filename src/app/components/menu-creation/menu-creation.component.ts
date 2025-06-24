import { DishService } from './../../services/dish/dish.service';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { capitalizeWords } from '../../utils/string-utils';
import { Dish } from '../../interfaces/dish.interface'; // Ajustar la ruta según estructura
// import { MenuService } from '../../services/menu/menu.service'; // Ajustar la ruta según estructura

@Component({
  selector: 'app-menu-creation',
  imports: [ReactiveFormsModule],
  templateUrl: './menu-creation.component.html',
  styleUrl: './menu-creation.component.css',
})
export class MenuCreationComponent {
  private dishService = inject(DishService); // 
  private enrutador = inject(Router);

  mensajeError: string = '';
  mensajeRespuesta: string = '';

  // Descripciones automáticas para cada plato
  private descripcionesPorPlato: { [key: string]: string } = {
    'Pollo asado': 'Pollo, ajo, romero, limón',
    'Crema de calabaza2': 'Calabaza2, nata2, cebolla2, nuez moscada2',
    'Lasaña': 'Carne, pasta, tomate, queso',
    'Pescado a la plancha': 'Pescado, limón, aceite, perejil',
    'Paella': 'Arroz, mariscos, pollo, azafrán',
    'Arroz chaufa': 'Arroz, pollo, salsa de soya y cebolla larga',
    'Ensalada César': 'Lechuga, pollo, queso parmesano, croutones',
    'Sopa de tomate': 'Tomate, cebolla, ajo, albahaca',
    'Gazpacho': 'Tomate, pepino, pimiento, ajo',
    'Crema de calabaza': 'Calabaza, nata, cebolla, nuez moscada'
  };

  public formulario = new FormGroup({
    nombre: new FormControl<string | null>(null, [
      Validators.required,
    ]),
    tipoDish: new FormControl<string | null>(null, [
      Validators.required,
    ]),
    descripcion: new FormControl<string | null>(null, [
      Validators.required,
      Validators.maxLength(500),
    ]),
    activo: new FormControl<boolean | null>(true),
  });

  constructor() {
    // Observar cambios en el nombre del plato para actualizar automáticamente la descripción
    this.formulario.get('nombre')?.valueChanges.subscribe(nombrePlato => {
      if (nombrePlato && this.descripcionesPorPlato[nombrePlato]) {
        this.formulario.patchValue({
          descripcion: this.descripcionesPorPlato[nombrePlato]
        });
      }
    });
  }

  alCrearDish() {
    console.log('Creando dish');
    
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    // Normalizar datos antes de enviar
    const datosDish: Dish = {
      name: this.formulario.value.nombre!, // Ya no necesita capitalizeWords porque viene del select
      dishType: this.formulario.value.tipoDish!,
      description: this.formulario.value.descripcion?.trim() || '',
      active: this.formulario.value.activo ? 1 : 0, // Convertir boolean a integer
    };

    console.log('Datos del dish:', datosDish);

    
    this.dishService.crearDish(datosDish).subscribe({
      next: (respuesta) => {
        if (respuesta) {
          console.log('Dish creado exitosamente', respuesta);
          this.mensajeRespuesta = 'El plato ha sido creado con éxito.';
          this.formulario.reset();
          this.formulario.patchValue({ activo: true }); // Resetear valor por defecto
          this.mensajeError = '';
          
          // Opcional: redirigir después de un tiempo
          setTimeout(() => {
            this.enrutador.navigate(['/dishes']); // Ajustar la ruta según aplicación
          }, 2000);
        } else {
          this.mensajeError = 'No se pudo crear el plato.';
        }
      },
      error: (err) => {
        console.error('Error al crear dish:', err);
        this.mensajeError = err.error?.message || 'No se pudo completar la creación del plato.';
        this.mensajeRespuesta = '';
      },
    });

  }

  irAtras() {
    this.enrutador.navigate(['/dishes']); // Ajustar la ruta según aplicación
  }
}