import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

import { clearAuthSession, hasValidAuthToken } from './auth-session';

export const authGuard: CanActivateFn = () => {
  if (hasValidAuthToken()) {
    return true;
  }

  clearAuthSession();
  return inject(Router).createUrlTree(['/login']);
};

export const loginGuard: CanActivateFn = () => {
  if (!hasValidAuthToken()) {
    return true;
  }

  return inject(Router).createUrlTree(['/home']);
};
