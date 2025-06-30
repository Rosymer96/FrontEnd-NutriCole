import { inject } from '@angular/core';
import { AuthService } from './../services/auth/auth.service';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const authToken = authService.getToken();
  const router = inject(Router);

  const publicRoutes = ['/user/login', '/user/register'];

  const isPublic = publicRoutes.some((url) => req.url.includes(url));

  if (authToken) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return next(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          // Borra token y redirige al login
          authService.logout?.(); // si tienes un método para limpiar tokens
          router.navigate(['/user/login']);
        }
        return throwError(() => error);
      })
    );
  }

  return next(req);
};
