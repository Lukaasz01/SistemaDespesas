import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

const API_HOSTS = ['http://localhost:9000', 'http://127.0.0.1:9000', 'http://[::1]:9000'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const isApiRequest = API_HOSTS.some((host) => req.url.startsWith(host));
  const token = sessionStorage.getItem('meu_token');

  const request = isApiRequest && token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    : req;

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (isApiRequest && (error.status === 401 || error.status === 403)) {
        sessionStorage.removeItem('meu_token');
        sessionStorage.removeItem('nomeUsuario');
        sessionStorage.removeItem('usuario_id');
        void router.navigate(['/login']);
      }

      return throwError(() => error);
    }),
  );
};
