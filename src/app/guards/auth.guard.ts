import { AuthService } from './../services/auth/auth.service';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const token = auth.isLoggedIn();

  if (token) {
    return true;
  } else {
    return router.navigate(['/login']);
  }
};
