import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {
  MenuByDay,
  MenuByMonthResponse,
  MenuEdited,
  MenuResponseCreated,
} from '../../interfaces/menu';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private httpClient = inject(HttpClient);
  private API_URL: string = `${environment.API_BASE_URL}/menu`;

  public getMenusByClassAndMonth(
    classId: number | string,
    monthDate: string
  ): Observable<MenuByMonthResponse> {
    return this.httpClient.get<MenuByMonthResponse>(
      `${this.API_URL}/listByClass/${classId}?monthDate=${monthDate}`
    );
  }
  public createMenu(
    date: string,
    classId: string,
    firstId: number,
    secondId: number,
    dessertId: number
  ): Observable<MenuResponseCreated> {
    return this.httpClient.post<MenuResponseCreated>(`${this.API_URL}/create`, {
      date,
      classId,
      firstId,
      secondId,
      dessertId,
    });
  }
  public getMenuByClassAndDay(
    classId: string,
    date: string
  ): Observable<MenuByDay> {
    return this.httpClient.get<MenuByDay>(
      `${this.API_URL}/byClassAndDate?classId=${classId}&date=${date}`
    );
  }

  public editMenu(
    menuId: string,
    firstId: number,
    secondId: number,
    dessertId: number
  ): Observable<MenuEdited> {
    return this.httpClient.put<MenuEdited>(
      `${this.API_URL}/${menuId}`,
      { firstId, secondId, dessertId }
    );
  }

  public deleteMenu(menuId: string): Observable<{ message: string }> {
    return this.httpClient.delete<{ message: string }>(
      `${this.API_URL}/${menuId}`
    );
  }
}
