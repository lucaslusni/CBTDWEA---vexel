import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { debounceTime, map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

// Aguarda a sessão reidratar antes de decidir, evitando redirect de usuários já logados
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.user$.pipe(
    debounceTime(100),
    take(1),
    map(user => (user ? true : router.createUrlTree(['/login'])))
  );
};
