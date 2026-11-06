import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, from, switchMap, throwError } from 'rxjs';
import { KeycloakAuthService } from '../services/keycloak-auth.service';

export const bearerInterceptor: HttpInterceptorFn = (request, next) => {
  const auth = inject(KeycloakAuthService);
  if (!auth.isKeycloak || !auth.isApiUrl(request.url)) return next(request);
  return from(auth.accessToken()).pipe(
    switchMap(token => next(request.clone({ withCredentials: false,
      setHeaders: { Authorization: 'Bearer ' + token } }))),
    catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401) auth.clear();
      // Never replay mutations or loop on a 403 / identity-provider outage.
      return throwError(() => error);
    })
  );
};
