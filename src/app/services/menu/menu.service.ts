import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { MenuByMonthResponse } from '../../interfaces/menu';
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
}
