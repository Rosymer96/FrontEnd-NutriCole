
// src/services/dish/dish.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CrearDishDto,ActualizarDishDto,Dish } from '../../interfaces/dish.interface'
import { obtenerHeaders } from '../../utils/utils';


@Injectable({
  providedIn: 'root'
})
export class DishService {
  private http = inject(HttpClient);
  
  // CAMBIAR POR TU URL BASE DEL BACKEND
  private readonly urlBase = `${environment.API_BASE_URL}/dish`;


  /**
   * Crear un nuevo plato
   * POST /api/dish/create
   */
  crearDish(dish: CrearDishDto): Observable<any> {
    return this.http.post(`${this.urlBase}/create`, dish, {
      headers: obtenerHeaders()
    });
  }

  /**
   * Obtener todos los platos
   * GET /api/dish/list
   */
  obtenerTodos(): Observable<Dish[]> {
    return this.http.get<Dish[]>(`${this.urlBase}/list`, {
      headers: obtenerHeaders()
    });
  }

  /**
   * Obtener platos por tipo
   * GET /api/dish/listByType/:dishType
   */
  obtenerPorTipo(tipoDish: string): Observable<Dish[]> {
    return this.http.get<Dish[]>(`${this.urlBase}/listByType/${tipoDish}`, {
      headers: obtenerHeaders()
    });
  }

  /**
   * Actualizar un plato existente
   * PUT /api/dish/:id
   */
  actualizarDish(id: number, dish: ActualizarDishDto): Observable<any> {
    return this.http.put(`${this.urlBase}/${id}`, dish, {
      headers: obtenerHeaders()
    });
  }

  /**
   * Eliminar plato físicamente
   * DELETE /api/dish/:id
   */
  eliminarDish(id: number): Observable<any> {
    return this.http.delete(`${this.urlBase}/${id}`, {
      headers: obtenerHeaders()
    });
  }

  /**
   * Eliminar plato lógicamente (cambiar active a 0)
   * PATCH /api/dish/softdelete/:id
   */
  desactivarDish(id: number): Observable<any> {
    return this.http.patch(`${this.urlBase}/softdelete/${id}`, {}, {
      headers: obtenerHeaders()
    });
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
   * Activar un plato (cambiar active a 1)
   * Nota: Implementar este endpoint en el backend si es necesario
   */
  activarDish(id: number): Observable<any> {
    const dishActualizado = { active: 1 };
    return this.actualizarDish(id, dishActualizado);
  }
}