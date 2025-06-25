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
  private userProfile: IUser | null = null;

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

  public getProfile(): Observable<IUser> {
    if (this.userProfile) {
      return of(this.userProfile);
    }

    const token = this.getToken();
    const rol = this.getCurrentRole();

    return this.httpClient
      .get<{ data: IUser }>(`${this.API_URL}/profile/${rol}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .pipe(
        map((res) => {
          this.userProfile = res.data;
          return res.data;
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
  public getCurrentUser(): IUser | null {
    const userJson = localStorage.getItem('currentUser');
    if (!userJson) return null;

    try {
      return JSON.parse(userJson) as IUser;
    } catch (error) {
      return null;
    }
  }

  public getCurrentRole(): string {
    const user = this.getCurrentUser();
    return user?.rol || '';
  }
}
function of(userProfile: IUser): Observable<IUser> {
  throw new Error('Function not implemented.');
}
