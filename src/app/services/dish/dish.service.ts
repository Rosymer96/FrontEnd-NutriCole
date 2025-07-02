import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { DishResponse } from '../../interfaces/dish';
import { ActualizarDishDto, CrearDishDto, Dish } from '../../interfaces/dish.interface';
import {  HttpHeaders } from '@angular/common/http';

import { obtenerHeaders } from '../../utils/utils';

@Injectable({
  providedIn: 'root',
})
export class DishService {
  private httpClient = inject(HttpClient);
  private API_URL: string = `${environment.API_BASE_URL}/dish`;

  public getAllDishes(): Observable<DishResponse> {
    return this.httpClient.get<DishResponse>(`${this.API_URL}/list`);
  }
  public getAllDishesActive(): Observable<DishResponse> {
    return this.httpClient.get<DishResponse>(`${this.API_URL}/list-active`);
  }
  // BehaviorSubject para mantener el estado de los platos
private dishesSubject = new BehaviorSubject<Dish[]>([]);
public dishes$ = this.dishesSubject.asObservable();

  /**
   * Actualizar el estado local de dishes
   */
  private actualizarDishesLocales(): void {
    this.obtenerTodos().subscribe({
      next: (dishes) => {
        this.dishesSubject.next(dishes);
      },
      error: (error) => {
        console.error('Error al actualizar platos locales:', error);
      },
    });
  }

  /**
   * Crear un nuevo plato
   * POST /api/dish/create
   */
  crearDish(dish: CrearDishDto): Observable<any> {
    return this.httpClient
      .post(`${this.API_URL}/create`, dish)
      .pipe(
        map((response: any) => {
          // Verificar si la respuesta indica error
          if (response && response.success === false) {
            throw new Error(response.message || 'Error al crear el plato');
          }

          // Actualizar estado local después de crear
          this.actualizarDishesLocales();
          return response;
        }),
        catchError((error) => {
          console.error('Error en crearDish:', error);
          throw error;
        })
      );
  }

  /**
   * Obtener todos los platos
   * GET /api/dish/list
   */
  obtenerTodos(): Observable<Dish[]> {
    return this.httpClient
      .get<any>(`${this.API_URL}/list`)
      .pipe(
        map((response: any) => {
          console.log('Respuesta obtenerTodos:', response);

          // Verificar si es un error del backend
          if (response && response.success === false) {
            throw new Error(response.message || 'Error al obtener los platos');
          }

          // Si la respuesta es directamente un array
          if (Array.isArray(response)) {
            return response.map((dish) => ({
              ...dish,
              active: dish.active ?? 1,
              id: dish.idDish ?? 0,
            }));
          }

          // Si la respuesta tiene formato { data: [...] }
          if (response && Array.isArray(response.data)) {
            return response.data.map((dish: any) => ({
              ...dish,
              active: dish.active ?? 1,
              id: dish.idDish ?? 0,
            }));
          }

          // Si no hay datos válidos, retornar array vacío
          console.warn(
            'Formato de respuesta no reconocido en obtenerTodos:',
            response
          );
          return [];
        }),
        catchError((error) => {
          console.error('Error en obtenerTodos:', error);

          // Si es un error de autenticación, retornar array vacío en lugar de fallar
          if (
            error.status === 401 ||
            (error.error && error.error.message === 'El token es obligatorio')
          ) {
            console.warn('Error de autenticación, retornando array vacío');
            return []; // Retorna array vacío en lugar de lanzar error
          }

          // Para otros errores, retornar array vacío también para evitar romper la app
          return [];
        })
      );
  }

  /**
   * Obtener platos por tipo
   * GET /api/dish/listByType/:dishType
   */
  obtenerPorTipo(tipoDish: string): Observable<Dish[]> {
    return this.httpClient
      .get<any>(`${this.API_URL}/listByType/${tipoDish}`)
      .pipe(
        map((response: any) => {
          console.log('Respuesta obtenerPorTipo:', response);

          // Verificar si es un error del backend
          if (response && response.success === false) {
            throw new Error(
              response.message || 'Error al obtener platos por tipo'
            );
          }

          // Tu backend devuelve: { success: true, data: [...], count: X }
          let dishes: Dish[] = [];

          if (response && Array.isArray(response.data)) {
            dishes = response.data;
          } else if (Array.isArray(response)) {
            dishes = response;
          } else {
            console.warn(
              'Formato de respuesta no reconocido en obtenerPorTipo:',
              response
            );
            return [];
          }

          return dishes.map((dish) => ({
            ...dish,
            active: dish.active ?? 1,
            idDish: dish.idDish ?? 0,
          }));
        }),
        catchError((error) => {
          console.error('Error en obtenerPorTipo:', error);

          // Si es un error de autenticación, retornar array vacío
          if (
            error.status === 401 ||
            (error.error && error.error.message === 'El token es obligatorio')
          ) {
            console.warn(
              'Error de autenticación en obtenerPorTipo, retornando array vacío'
            );
            return [];
          }

          return [];
        })
      );
  }

  /**
   * Obtener un plato por ID
   * GET /api/dish/:id
   */
  obtenerPorId(id: number): Observable<Dish> {
    return this.httpClient
      .get<any>(`${this.API_URL}/${id}`)
      .pipe(
        map((response: any) => {
          console.log('Respuesta obtenerPorId:', response);

          // Verificar si es un error del backend
          if (response && response.success === false) {
            throw new Error(response.message || 'Error al obtener el plato');
          }

          // Manejar diferentes formatos de respuesta del backend
          let dish: Dish;

          if (response && response.name) {
            // Si la respuesta es directamente el dish
            dish = response;
          } else if (response && response.data && response.data.name) {
            // Si la respuesta tiene formato { data: {...} }
            dish = response.data;
          } else if (response && response.dish && response.dish.name) {
            // Si la respuesta tiene formato { dish: {...} }
            dish = response.dish;
          } else if (response && response.result && response.result.name) {
            // Si la respuesta tiene formato { result: {...} }
            dish = response.result;
          } else {
            throw new Error('Formato de respuesta no válido en obtenerPorId');
          }

          return {
            ...dish,
            active: dish.active ?? 1,
            idDish: dish.idDish ?? id,
          };
        }),
        catchError((error) => {
          console.error('Error en obtenerPorId:', error);
          throw error;
        })
      );
  }

  /**
   * Actualizar un plato existente
   * PUT /api/dish/:id
   */
  actualizarDish(id: number, dish: ActualizarDishDto): Observable<any> {
    // Tu backend requiere todos los campos, así que necesitamos obtener el plato actual
    // si no se proporcionan todos los campos
    const dishCompleto = {
      name: dish.name,
      dishType: dish.dishType,
      description: dish.description,
      active: dish.active,
      // No enviar 'active' en el update normal, solo en toggle
    };

    return this.httpClient
      .put(`${this.API_URL}/${id}`, dishCompleto)
      .pipe(
        map((response: any) => {
          // Verificar si es un error del backend
          if (response && response.success === false) {
            throw new Error(response.message || 'Error al actualizar el plato');
          }

          // Tu backend devuelve: { message: "Plato actualizado correctamente" }
          this.actualizarDishesLocales();
          return response;
        }),
        catchError((error) => {
          console.error('Error en actualizarDish:', error);
          throw error;
        })
      );
  }

  /**
   * Eliminar plato físicamente
   * DELETE /api/dish/:id
   */
  eliminarDish(id: number): Observable<any> {
    return this.httpClient
      .delete(`${this.API_URL}/${id}`)
      .pipe(
        map((response: any) => {
          // Verificar si es un error del backend
          if (response && response.success === false) {
            throw new Error(response.message || 'Error al eliminar el plato');
          }

          // Actualizar estado local después de eliminar
          this.actualizarDishesLocales();
          return response;
        }),
        catchError((error) => {
          console.error('Error en eliminarDish:', error);
          throw error;
        })
      );
  }

  /**
   * Eliminar plato lógicamente (cambiar active a 0)
   * PATCH /api/dish/softdelete/:id
   */
  desactivarDish(id: number): Observable<any> {
    return this.httpClient
      .patch(
        `${this.API_URL}/softdelete/${id}`,
        {}
      )
      .pipe(
        map((response: any) => {
          // Verificar si es un error del backend
          if (response && response.success === false) {
            throw new Error(response.message || 'Error al desactivar el plato');
          }

          // Actualizar estado local después de desactivar
          this.actualizarDishesLocales();
          return response;
        }),
        catchError((error) => {
          console.error('Error en desactivarDish:', error);
          throw error;
        })
      );
  }

  /**
   * Activar un plato (cambiar active a 1)
   */
  activarDish(id: number): Observable<any> {
    const dishActualizado = { active: 1 };
    return this.actualizarDish(id, dishActualizado);
  }

  /**
   * Cambiar estado de un plato (activar/desactivar)
   */
  toggleEstadoDish(id: number, estadoActual: number): Observable<any> {
    const nuevoEstado = estadoActual === 1 ? 0 : 1;

    if (nuevoEstado === 0) {
      // Usar softdelete para desactivar
      return this.desactivarDish(id);
    } else {
      // Usar actualizar para activar
      return this.activarDish(id);
    }
  }

  // Métodos de conveniencia adicionales

  /**
   * Obtener solo platos de primeros
   */
  obtenerPrimeros(): Observable<Dish[]> {
    return this.obtenerPorTipo('primero');
  }

  /**
   * Obtener solo platos de segundos
   */
  obtenerSegundos(): Observable<Dish[]> {
    return this.obtenerPorTipo('segundo');
  }

  /**
   * Obtener solo postres
   */
  obtenerPostres(): Observable<Dish[]> {
    return this.obtenerPorTipo('postre');
  }

  /**
   * Obtener solo platos activos
   */
  obtenerActivos(): Observable<Dish[]> {
    return this.obtenerTodos().pipe(
      map((dishes) => dishes.filter((dish) => dish.active === 1))
    );
  }

  /**
   * Obtener solo platos inactivos
   */
  obtenerInactivos(): Observable<Dish[]> {
    return this.obtenerTodos().pipe(
      map((dishes) => dishes.filter((dish) => dish.active === 0))
    );
  }

  /**
   * Buscar platos por nombre o descripción
   */
  buscarDishes(termino: string): Observable<Dish[]> {
    return this.obtenerTodos().pipe(
      map((dishes) => {
        const terminoLower = termino.toLowerCase().trim();
        return dishes.filter(
          (dish) =>
            dish.name.toLowerCase().includes(terminoLower) ||
            dish.description.toLowerCase().includes(terminoLower)
        );
      })
    );
  }

  /**
   * Filtrar platos por múltiples criterios
   */
  filtrarDishes(filtros: {
    tipo?: string;
    estado?: string;
    busqueda?: string;
  }): Observable<Dish[]> {
    return this.obtenerTodos().pipe(
      map((dishes) => {
        let dishesFiltrados = [...dishes];

        // Filtro por tipo
        if (filtros.tipo) {
          dishesFiltrados = dishesFiltrados.filter(
            (dish) => dish.dish_type === filtros.tipo
          );
        }

        // Filtro por estado
        if (filtros.estado) {
          const estadoFiltro = filtros.estado === 'activo' ? 1 : 0;
          dishesFiltrados = dishesFiltrados.filter(
            (dish) => dish.active === estadoFiltro
          );
        }

        // Filtro por búsqueda
        if (filtros.busqueda?.trim()) {
          const termino = filtros.busqueda.toLowerCase().trim();
          dishesFiltrados = dishesFiltrados.filter(
            (dish) =>
              dish.name.toLowerCase().includes(termino) ||
              dish.description.toLowerCase().includes(termino)
          );
        }

        return dishesFiltrados;
      })
    );
  }

  /**
   * Obtener estadísticas de platos
   */
  obtenerEstadisticas(): Observable<{
    total: number;
    activos: number;
    inactivos: number;
    primeros: number;
    segundos: number;
    postres: number;
  }> {
    return this.obtenerTodos().pipe(
      map((dishes) => ({
        total: dishes.length,
        activos: dishes.filter((d) => d.active === 1).length,
        inactivos: dishes.filter((d) => d.active === 0).length,
        primeros: dishes.filter((d) => d.dish_type === 'primero').length,
        segundos: dishes.filter((d) => d.dish_type === 'segundo').length,
        postres: dishes.filter((d) => d.dish_type === 'postre').length,
      }))
    );
  }

  /**
   * Validar si existe un plato con el mismo nombre
   */
  validarNombreUnico(nombre: string, idExcluir?: number): Observable<boolean> {
    return this.obtenerTodos().pipe(
      map((dishes) => {
        const nombreLower = nombre.toLowerCase().trim();
        const existe = dishes.some(
          (dish) =>
            dish.name.toLowerCase() === nombreLower && dish.idDish !== idExcluir
        );
        return !existe; // Retorna true si es único (no existe)
      })
    );
  }

  /**
   * Forzar actualización del estado local
   */
  refrescarDishes(): void {
    this.actualizarDishesLocales();
  }

  /**
   * Obtener el estado actual de dishes sin suscripción
   */
  obtenerDishesActuales(): Dish[] {
    return this.dishesSubject.value;
  }

  /**
   * Verificar si el usuario está autenticado antes de hacer peticiones
   */
  private isAuthenticated(): boolean {
    const token = localStorage.getItem('authtoken');
    return !!token;
  }

  /**
   * Método para manejar errores de autenticación globalmente
   */
  private handleAuthError(error: any): Observable<never> {
    if (
      error.status === 401 ||
      (error.error && error.error.message === 'El token es obligatorio')
    ) {
      console.warn('Usuario no autenticado. Redirigir al login.');
      // Aquí puedes agregar lógica para redirigir al login
      // this.router.navigate(['/login']);
    }
    return throwError(() => error);
  }
}


