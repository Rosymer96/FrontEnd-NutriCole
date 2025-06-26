import { inject } from '@angular/core';
import { AuthService } from './../services/auth/auth.service';
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const authToken = authService.getToken();

  const publicRoutes = ['/user/login', '/user/register'];

  const isPublic = publicRoutes.some((url) => req.url.includes(url));

  if (authToken) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return next(authReq);
  }

  return next(req);
};
