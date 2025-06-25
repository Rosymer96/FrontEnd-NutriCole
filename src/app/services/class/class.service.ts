import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { map, Observable } from 'rxjs';
import { ClassResponse, IClass } from '../../interfaces/class';

@Injectable({
  providedIn: 'root',
})
export class ClassService {
  private httpClient = inject(HttpClient);
  private API_URL: string = `${environment.API_BASE_URL}/class`;

  public getClasses(): Observable<ClassResponse> {
    return this.httpClient.get<ClassResponse>(`${this.API_URL}/list`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
  }
}
