import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, switchMap } from 'rxjs';
import { AuthService } from './services/auth.service';

// Interceptor de autenticação para anexar o token JWT (Firebase ID Token)
// em todas as requisições HTTP feitas pelo HttpClient.
export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  // Injeta o serviço de autenticação para conseguir pegar o ID token
  const auth = inject(AuthService);

  // getIdToken() retorna uma Promise, então usamos `from` para transformar em Observable
  return from(auth.getIdToken()).pipe(
    switchMap(token => {
      // Se não houver token (usuário não logado ou erro), segue a requisição original
      if (!token) return next(req);

      // Clona a requisição original adicionando o cabeçalho Authorization: Bearer <token>
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Passa a nova requisição (com token) para o próximo interceptor / HttpHandler
      return next(authReq);
    })
  );
};
