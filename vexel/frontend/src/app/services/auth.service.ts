import { Injectable, inject } from '@angular/core';
import { Auth, user, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  user$ = user(this.auth);
  isLoggedIn$ = this.user$.pipe(map(currentUser => !!currentUser));

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }

  async getIdToken(): Promise<string | null> {
    await this.auth.authStateReady();
    // Let Firebase use or refresh its token; avoid a separate stale token cache.
    return this.auth.currentUser ? this.auth.currentUser.getIdToken() : null;
  }
}

