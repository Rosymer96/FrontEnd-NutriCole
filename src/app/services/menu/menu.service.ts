import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {
  MenuByDay,
  MenuByMonthResponse,
  MenuResponse,
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
    firstId: string,
    secondId: string,
    dessertId: string
  ): Observable<MenuResponse> {
    return this.httpClient.post<MenuResponse>(`${this.API_URL}/create`, {
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
}
