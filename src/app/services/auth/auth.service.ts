import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { IUser } from '../../interfaces/user';
import { LoginResponse } from '../../interfaces/userResponses';
import { map, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpClient = inject(HttpClient);
  private router = inject(Router);

  private API_URL: string = `${environment.API_BASE_URL}/user`;

  public login(email: string, password: string): Observable<IUser | null> {
    return this.httpClient
      .post<LoginResponse>(`${this.API_URL}/login`, { email, password })
      .pipe(
        map((response) => {
          if (response && response.token) {
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('userId', response.user.id.toString());
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            return response.user;
          }
          return null;
        })
      );
  }

  public logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
  public getToken(): string | null {
    return localStorage.getItem('authToken');
  }
  public isLoggedIn(): boolean {
    const token = this.getToken();
    return token ? true : false;
  }
}
