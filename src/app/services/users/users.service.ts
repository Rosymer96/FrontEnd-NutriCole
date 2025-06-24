import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import {
  RegisterResponse,
} from '../../interfaces/userResponses';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private httpClient = inject(HttpClient);
  private API_URL: string = `${environment.API_BASE_URL}/user`;

  public register(
    name: string,
    email: string,
    password: string,
    dni: string
  ): Observable<RegisterResponse> {
    return this.httpClient.post<RegisterResponse>(
      `${this.API_URL}/register/tutor`,
      { name, email, password, dni }
    );
  }
}
