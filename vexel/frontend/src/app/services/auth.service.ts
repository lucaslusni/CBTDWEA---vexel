import { Injectable, NgZone, inject } from '@angular/core';
import { Auth, user, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { BehaviorSubject, filter, firstValueFrom, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Injeta a instância do Auth do Firebase
  private auth = inject(Auth);
  // Injeta a NgZone para voltar pra zona do Angular quando callbacks externos dispararem
  private zone = inject(NgZone);

  // Observable do usuário logado (null se não houver usuário)
  user$ = user(this.auth);
  // Observable booleana indicando se está logado ou não
  isLoggedIn$ = this.user$.pipe(map(u => !!u));

  // BehaviorSubject para armazenar o token:
  // - undefined = ainda não carregou
  // - string/null = já sabemos o valor do token
  private token$ = new BehaviorSubject<string | null | undefined>(undefined);
  // Cache em memória do token atual
  private currentToken: string | null = null;

  constructor() {
    // Ouve alterações no ID token do Firebase (login, refresh, logout, etc.)
    this.auth.onIdTokenChanged(user => {
      // Esse callback roda fora da zona; usamos zone.run para reentrar na zona Angular
      this.zone.run(async () => {
        // Se houver usuário, pega o ID token; senão, seta como null
        this.currentToken = user ? await user.getIdToken() : null;
        // Emite o novo valor para quem estiver inscrito
        this.token$.next(this.currentToken);
      });
    });
  }

  // Faz login usando email/senha via Firebase Auth
  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  // Faz logout do Firebase
  logout() {
    return signOut(this.auth);
  }

  // Retorna o ID token atual (ou null se não estiver logado)
  async getIdToken(): Promise<string | null> {
    // Se currentToken já foi definido (string ou null), retorna direto
    if (this.currentToken !== null) return this.currentToken;

    // Caso ainda não tenhamos um valor definido, espera até o BehaviorSubject emitir
    const token = await firstValueFrom(
      this.token$.pipe(
        // Ignora o estado "undefined" (ainda carregando)
        filter((value): value is string | null => value !== undefined)
      )
    );

    return token;
  }
}
