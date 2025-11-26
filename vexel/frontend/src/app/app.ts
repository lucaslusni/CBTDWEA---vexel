import { Component, inject } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root', // seletor do componente raiz (usado em index.html)
  standalone: true,     // componente standalone, não precisa de módulo
  imports: [
    CommonModule,       // diretivas básicas do Angular (*ngIf, *ngFor, etc.)
    AsyncPipe,          // permite usar o pipe async direto no template
    RouterOutlet,       // onde as rotas são renderizadas
    RouterLink,         // diretiva para links de navegação
    RouterLinkActive    // adiciona classes quando a rota está ativa
  ],
  templateUrl: './app.html', // template principal com topbar + <router-outlet>
  styleUrls: ['./app.scss']  // estilos da aplicação (layout, topbar etc.)
})
export class App {
  // injeta o serviço de autenticação para acessar o usuário atual e fazer logout
  private auth = inject(AuthService);
  // injeta o Router para redirecionar após o logout
  private router = inject(Router);

  // observable do usuário logado; usado no template com | async
  user$ = this.auth.user$;

  // método chamado ao clicar no botão "Sair" no header
  async logout() {
    // dispara o logout no Firebase Auth
    await this.auth.logout();
    // redireciona o usuário para a tela de login
    this.router.navigate(['/login']);
  }
}
