import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router
} from '@angular/router';

import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {

  const authService =
    inject(AuthService);

  const router =
    inject(Router);

  // Allow logged-in users
  if (authService.isLoggedIn()) {
    return true;
  }

  // Redirect logged-out users
  return router.createUrlTree([
    '/login'
  ]);
};