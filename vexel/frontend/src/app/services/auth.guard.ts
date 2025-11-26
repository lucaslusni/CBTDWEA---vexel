import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';

// Guarda de rota em formato de função (CanActivateFn) usando o novo estilo standalone do Angular
export const authGuard: CanActivateFn = async () => {
  // injeta o serviço de autenticação no contexto da função (sem precisar de classe)
  const auth = inject(AuthService);

  // injeta o Router para poder redirecionar se o usuário não estiver logado
  const router = inject(Router);

  // pega o valor atual do observable isLoggedIn$ convertendo para Promise (1º valor)
  const ok = await firstValueFrom(auth.isLoggedIn$);

  // se não estiver autenticado, manda pra página de login
  if (!ok) router.navigateByUrl('/login');

  // retorna true/false para o Angular decidir se pode ativar a rota
  return ok;
};
