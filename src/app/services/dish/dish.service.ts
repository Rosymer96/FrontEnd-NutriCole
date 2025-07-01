import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { DishResponse } from '../../interfaces/dish';

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
}
