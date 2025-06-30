import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { NoteResponse } from '../interfaces/note';

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  private httpClient = inject(HttpClient);
  private API_URL: string = `${environment.API_BASE_URL}/note`;

  public createNote(
    menuId: number,
    note: string
  ): Observable<{ message: string }> {
    return this.httpClient.post<{ message: string }>(`${this.API_URL}/create`, {
      menuId,
      note,
    });
  }

  public updateNote(
    menuId: number,
    note: string
  ): Observable<{ message: string }> {
    return this.httpClient.put<{ message: string }>(`${this.API_URL}/`, {
      menuId,
      note,
    });
  }
  public saveOrUpdate(
    menuId: number,
    note: string
  ): Observable<{ message: string }> {
    return this.httpClient.post<{ message: string }>(`${this.API_URL}/save`, {
      menuId,
      note,
    });
  }
  public getNote(menuId: number): Observable<NoteResponse> {
    return this.httpClient.get<NoteResponse>(`${this.API_URL}/${menuId}`);
  }
}
