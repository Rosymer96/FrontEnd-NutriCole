import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { IUser } from '../interfaces/user';
import { LoginResponse } from '../interfaces/loginResponse';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private httpClient = inject(HttpClient);

  private API_URL: string = `${environment.API_BASE_URL}/user`;

  public login(email: string, password: string): Observable<IUser | null> {
    return this.httpClient
      .post<LoginResponse>(`${this.API_URL}/login`, { email, password })
      .pipe(
        map((response) => {
          if (response && response.token) {
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('userId', response.user.id.toString());
            return response.user;
          }
          return null;
        })
      );
  }
}
