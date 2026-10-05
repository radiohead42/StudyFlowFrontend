import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

import {
  catchError,
  switchMap,
  throwError
} from 'rxjs';

import { Auth } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {

  const authService = inject(Auth);
  const router = inject(Router);
  const isAuthRequest = request.url.startsWith(`${environment.apiUrl}/auth/`);
  const isApiRequest = request.url.startsWith(environment.apiUrl);

  // Login, register y refresh no necesitan
  // pasar por la lógica del token.
  if (isAuthRequest) {
    return next(request);
  }

  if (!isApiRequest) {
    return next(request);
  }

  const token = sessionStorage.getItem(
    'studyflow_access_token'
  );

  if (!token) {
    return next(request);
  }

  // Si el token sigue siendo válido,
  // lo agregamos normalmente.
  if (!authService.isAccessTokenExpired()) {

    const authenticatedRequest =
      request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });

    return next(authenticatedRequest);
  }

  // Si expiró, intentamos renovarlo.
  return authService
    .refreshToken()
    .pipe(

      switchMap(() => {

        const newToken =
          sessionStorage.getItem(
            'studyflow_access_token'
          );

        if (!newToken) {
          return throwError(
            () => new Error(
              'No se pudo obtener un nuevo access token'
            )
          );
        }

        const authenticatedRequest =
          request.clone({
            setHeaders: {
              Authorization:
                `Bearer ${newToken}`
            }
          });

        return next(
          authenticatedRequest
        );
      }),

      catchError(error => {

        authService.logout();

        router.navigate(['/login']);

        return throwError(
          () => error
        );
      })
    );
};
