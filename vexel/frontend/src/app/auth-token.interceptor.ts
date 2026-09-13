import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, switchMap } from 'rxjs';
import { AuthService } from './services/auth.service';
import { environment } from '../environments/environment';
import { isApiUrl } from './api-url';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  if (!isApiUrl(req.url, environment.apiUrl)) return next(req);

  const auth = inject(AuthService);
  return from(auth.getIdToken()).pipe(
    switchMap(token => {
      if (!token) return next(req);
      return next(req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      }));
    })
  );
};

