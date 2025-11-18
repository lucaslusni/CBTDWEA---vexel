import { Injectable, inject } from '@angular/core';
import { Auth, user, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { map, firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  user$ = user(this.auth); // observable do usuário logado
  isLoggedIn$ = this.user$.pipe(map(u => !!u));

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() { return signOut(this.auth); }

  async getIdToken(): Promise<string | null> {
    const u = await firstValueFrom(this.user$);
    return u ? u.getIdToken() : null;
  }
}
