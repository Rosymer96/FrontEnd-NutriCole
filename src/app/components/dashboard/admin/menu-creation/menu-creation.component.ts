import { DishService } from './../../../../services/dish/dish.service';
import { Component, inject, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { capitalizeWords } from '../../../../utils/string-utils';
import { Dish } from '../../../../interfaces/dish.interface';

@Component({
  selector: 'app-menu-creation',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './menu-creation.component.html',
  styleUrl: './menu-creation.component.css',
})
export class MenuCreationComponent implements OnInit {
  private dishService = inject(DishService);
  private router = inject(Router);

  // Estados del componente
  dishes: Dish[] = [];
  dishesFiltrados: Dish[] = [];
  cargando = false;
  guardando = false;
  mostrarFormulario = false;
  modoEdicion = false;
  dishEditando: Dish | null = null;
  dishAEliminar: Dish | null = null;
  modalVisible = false;

  // Mensajes
  mensajeError: string = '';
  mensajeRespuesta: string = '';

  // Filtros
  filtroTexto: string = '';
  filtroTipo: string = '';
  filtroEstado: string = '';

  // Formulario reactivo
  public formulario = new FormGroup({
    nombre: new FormControl<string>('', [
      Validators.required,
      Validators.maxLength(100),
    ]),
    tipoDish: new FormControl<string>('', [Validators.required]),
    descripcion: new FormControl<string>('', [
      Validators.required,
      Validators.maxLength(500),
    ]),
    activo: new FormControl<number>(1),
  });

  ngOnInit() {
    this.cargarDishes();
  }

  // Métodos para cargar datos
  cargarDishes() {
    this.cargando = true;
    this.mensajeError = '';

    this.dishService.obtenerTodos().subscribe({
      next: (dishes) => {
        console.log('✅ Dishes cargados correctamente:', dishes);
        this.dishes = dishes || [];
        this.aplicarFiltros();
        this.cargando = false;
      },
      error: (err) => {
        console.error('❌ Error al cargar dishes:', err);
        this.mensajeError =
          'Error al cargar la lista de platos. Verifique la conexión con el servidor.';
        this.cargando = false;
        this.dishes = [];
        this.dishesFiltrados = [];
      },
    });
  }
  goToDashboard() {
    this.router.navigate(['/dashboard-admin']);
  }
  // Métodos para crear/editar
  guardarDish() {
    console.log('🧪 Ejecutando guardarDish()');
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.guardando = true;
    this.mensajeError = '';
    this.mensajeRespuesta = '';

    const datosDish: any = {
      name: capitalizeWords(this.formulario.value.nombre!.trim()),
      dishType: this.formulario.value.tipoDish!,
      description: this.formulario.value.descripcion?.trim() || '',
      active: this.formulario.value.activo,
    };

    if (this.modoEdicion && this.dishEditando) {
      // Actualizar dish existente - tu backend requiere todos los campos
      const dishId = this.dishEditando.idDish;
      if (!dishId) {
        this.mensajeError = 'Error: No se puede actualizar el plato sin ID.';
        this.guardando = false;
        return;
      }

      // Enviar todos los campos requeridos por tu backend
      const datosCompletos = {
        name: datosDish.name,
        dishType: datosDish.dishType,
        description: datosDish.description,
        active: datosDish.active,
      };
      console.log('DATOS COMPLETOS: ', datosCompletos);
      this.dishService.actualizarDish(dishId, datosCompletos).subscribe({
        next: (respuesta) => {
          this.mensajeRespuesta = 'Plato actualizado con éxito.';
          this.resetearFormulario();
          this.cargarDishes();
          this.guardando = false;
          this.limpiarMensajeDespuesDeTiempo();
          console.log('Datos actualizar:', dishId, datosCompletos);
        },
        error: (err) => {
          console.error('Error al actualizar dish:', err);
          this.mensajeError =
            err.error?.error ||
            err.error?.message ||
            'Error al actualizar el plato.';
          this.guardando = false;
          this.limpiarMensajeDespuesDeTiempo();
        },
      });
    } else {
      // Crear nuevo dish
      this.dishService.crearDish(datosDish).subscribe({
        next: (respuesta) => {
          this.mensajeRespuesta = 'Plato creado con éxito.';
          this.resetearFormulario();
          this.cargarDishes();
          this.guardando = false;
          this.limpiarMensajeDespuesDeTiempo();
          console.log('✅ Plato creado:', respuesta);
        },
        error: (err) => {
          console.error('Error al crear dish:', err);
          this.mensajeError =
            err.error?.error ||
            err.error?.message ||
            'Error al crear el plato.';
          this.guardando = false;
          this.limpiarMensajeDespuesDeTiempo();
        },
      });
    }
  }

  editarDish(dish: Dish) {
    this.modoEdicion = true;
    this.dishEditando = dish;
    this.mostrarFormulario = true;

    this.formulario.patchValue({
      nombre: dish.name,
      tipoDish: dish.dish_type,
      descripcion: dish.description,
      activo: dish.active,
    });

    // Scroll al formulario
    setTimeout(() => {
      const formElement = document.querySelector('.card');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }

  cancelarEdicion() {
    this.resetearFormulario();
  }

  resetearFormulario() {
    this.formulario.reset();
    this.formulario.patchValue({ activo: 1 });
    this.mostrarFormulario = false;
    this.modoEdicion = false;
    this.dishEditando = null;
    this.mensajeError = '';
    this.mensajeRespuesta = '';
  }

  // Métodos para eliminar - SIN BOOTSTRAP
  confirmarEliminar(dish: Dish) {
    console.log('🗑️ Confirmando eliminación de:', dish.name);
    this.dishAEliminar = dish;
    this.modalVisible = true;

    // Aplicar estilo al body para evitar scroll
    document.body.style.overflow = 'hidden';

    // Agregar backdrop
    this.crearBackdrop();
  }

  eliminarDish() {
    if (!this.dishAEliminar) return;

    const dishId = this.dishAEliminar.idDish;
    if (!dishId) {
      this.mensajeError = 'Error: No se puede eliminar el plato sin ID.';
      this.cancelarEliminacion();
      return;
    }

    console.log('🗑️ Eliminando dish:', this.dishAEliminar.name);

    this.dishService.eliminarDish(dishId).subscribe({
      next: () => {
        this.mensajeRespuesta = `Plato "${
          this.dishAEliminar!.name
        }" eliminado con éxito.`;
        this.cancelarEliminacion();
        this.cargarDishes();
        this.limpiarMensajeDespuesDeTiempo();
      },
      error: (err) => {
        console.error('❌ Error al eliminar:', err);
        this.mensajeError = err.error?.message || 'Error al eliminar el plato.';
        this.cancelarEliminacion();
        this.limpiarMensajeDespuesDeTiempo();
      },
    });
  }

  cancelarEliminacion() {
    console.log('❌ Cancelando eliminación');
    this.dishAEliminar = null;
    this.modalVisible = false;

    // Restaurar scroll del body
    document.body.style.overflow = 'auto';

    // Remover backdrop
    this.removerBackdrop();
  }

  // Método para cambiar estado activo/inactivo
  toggleEstadoDish(dish: Dish) {
    const dishId = dish.idDish;
    if (!dishId) {
      this.mensajeError =
        'Error: No se puede cambiar el estado del plato sin ID.';
      return;
    }

    if (dish.active === 1) {
      // Desactivar usando el endpoint específico
      this.dishService.desactivarDish(dishId).subscribe({
        next: () => {
          this.mensajeRespuesta = `Plato "${dish.name}" desactivado con éxito.`;
          this.cargarDishes();
          this.limpiarMensajeDespuesDeTiempo();
        },
        error: (err) => {
          console.error('Error al desactivar dish:', err);
          this.mensajeError =
            err.error?.message || 'Error al desactivar el plato.';
          this.limpiarMensajeDespuesDeTiempo();
        },
      });
    } else {
      // Para activar, necesitamos usar el método de actualización completo
      // porque tu backend no tiene un endpoint específico para activar
      const datosCompletos = {
        name: dish.name,
        dishType: dish.dish_type,
        description: dish.description,
        active: 1,
      };

      this.dishService.actualizarDish(dishId, datosCompletos).subscribe({
        next: () => {
          this.mensajeRespuesta = `Plato "${dish.name}" activado con éxito.`;
          this.cargarDishes();
          this.limpiarMensajeDespuesDeTiempo();
        },
        error: (err) => {
          console.error('Error al activar dish:', err);
          this.mensajeError =
            err.error?.message || 'Error al activar el plato.';
          this.limpiarMensajeDespuesDeTiempo();
        },
      });
    }
  }

  // Métodos para filtrado
  aplicarFiltros() {
    let dishesFiltrados = [...this.dishes];

    // Filtro por texto (nombre o descripción)
    if (this.filtroTexto.trim()) {
      const texto = this.filtroTexto.toLowerCase().trim();
      dishesFiltrados = dishesFiltrados.filter(
        (dish) =>
          dish.name.toLowerCase().includes(texto) ||
          dish.description.toLowerCase().includes(texto)
      );
    }

    // Filtro por tipo
    if (this.filtroTipo) {
      dishesFiltrados = dishesFiltrados.filter(
        (dish) => dish.dish_type === this.filtroTipo
      );
    }

    // Filtro por estado
    if (this.filtroEstado) {
      const estadoFiltro = this.filtroEstado === 'activo' ? 1 : 0;
      dishesFiltrados = dishesFiltrados.filter(
        (dish) => dish.active === estadoFiltro
      );
    }

    this.dishesFiltrados = dishesFiltrados;
  }

  limpiarFiltros() {
    this.filtroTexto = '';
    this.filtroTipo = '';
    this.filtroEstado = '';
    this.aplicarFiltros();
  }

  // Método para optimizar el rendimiento de *ngFor
  trackByDishId(index: number, dish: Dish): any {
    return dish.idDish || index;
  }

  // Método de navegación (si se necesita)
  irAtras() {
    this.router.navigate(['/']);
  }

  // ========== MÉTODOS AUXILIARES PARA MODAL  ==========

  private crearBackdrop() {
    // Crear backdrop si no existe
    let backdrop = document.getElementById('modal-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.id = 'modal-backdrop';
      backdrop.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 1040;
        opacity: 0;
        transition: opacity 0.15s linear;
      `;

      // Cerrar modal al hacer click en el backdrop
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          this.cancelarEliminacion();
        }
      });

      document.body.appendChild(backdrop);

      // Animar entrada
      setTimeout(() => {
        backdrop!.style.opacity = '1';
      }, 10);
    }
  }

  private removerBackdrop() {
    const backdrop = document.getElementById('modal-backdrop');
    if (backdrop) {
      backdrop.style.opacity = '0';
      setTimeout(() => {
        if (backdrop.parentNode) {
          document.body.removeChild(backdrop);
        }
      }, 150);
    }
  }

  private limpiarMensajeDespuesDeTiempo() {
    setTimeout(() => {
      this.mensajeError = '';
      this.mensajeRespuesta = '';
    }, 4000);
  }

  // Manejo de tecla Escape para cerrar modal
  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey(event: KeyboardEvent) {
    if (this.modalVisible) {
      this.cancelarEliminacion();
    }
  }

  // ========== MÉTODOS PARA OBTENER ICONOS ==========

  // Iconos para tipos de plato
  getIconoTipoPlato(tipo: string): string {
    switch (tipo) {
      case 'primero':
        return '🥗'; // Ensalada para primeros
      case 'segundo':
        return '🍽️'; // Plato principal
      case 'postre':
        return '🧁'; // Cupcake para postres
      default:
        return '🍴'; // Cubiertos genérico
    }
  }

  // Iconos para estados
  getIconoEstado(activo: number): string {
    return activo === 1 ? '✅' : '❌';
  }

  // Iconos para acciones
  getIconoAccion(accion: string): string {
    switch (accion) {
      case 'editar':
        return '✏️';
      case 'activar':
        return '👁️';
      case 'desactivar':
        return '❗';
      case 'eliminar':
        return '🗑️';
      case 'guardar':
        return '💾';
      case 'cancelar':
        return '❌';
      case 'buscar':
        return '🔍';
      case 'limpiar':
        return '🧹';
      case 'refrescar':
        return '🔄';
      case 'nuevo':
        return '➕';
      case 'warning':
        return '⚠️';
      case 'success':
        return '✅';
      case 'error':
        return '❗';
      case 'loading':
        return '⏳';
      default:
        return '🔹';
    }
  }

  // Método para obtener tooltip profesional para acciones
  getTooltipAccion(dish: Dish, accion: string): string {
    switch (accion) {
      case 'editar':
        return `Editar plato: ${dish.name}`;
      case 'toggle':
        return dish.active === 1
          ? `Desactivar plato: ${dish.name}`
          : `Activar plato: ${dish.name}`;
      case 'eliminar':
        return `Eliminar permanentemente: ${dish.name}`;
      default:
        return '';
    }
  }

  // CSS class para botones de estado
  getClaseBotonEstado(dish: Dish): string {
    return dish.active === 1 ? 'btn-outline-warning' : 'btn-outline-success';
  }

  // Texto del botón de estado
  getTextoBotonEstado(dish: Dish): string {
    return dish.active === 1 ? 'Desactivar' : 'Activar';
  }
}
