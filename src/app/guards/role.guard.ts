import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const expectedRoles = route.data['role'] as Array<string> | undefined;
  const userRole = auth.getCurrentRole();

  if (expectedRoles && expectedRoles.includes(userRole)) {
    return true;
  } else {
    alert('No tienes acceso a esta página');
    return router.navigate(['/login']);
  }
};
