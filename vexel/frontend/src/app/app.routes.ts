// Define o array de rotas principais da aplicação Angular
import { Routes } from '@angular/router';

// Importa os componentes de página (standalone components)
import { Login } from './pages/login/login';
import { Vehicles } from './pages/vehicles/vehicles';
import { Reports } from './pages/reports/reports';

// Importa o guard de autenticação (protege rotas privadas)
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Rota da tela de login (pública)
  { path: 'login', component: Login },

  // Rota raiz: redireciona para /vehicles
  { path: '', redirectTo: 'vehicles', pathMatch: 'full' },

  // Rota de veículos, protegida pelo authGuard
  { path: 'vehicles', component: Vehicles, canActivate: [authGuard] },

  // Rota de relatórios, também protegida pelo authGuard
  { path: 'reports', component: Reports, canActivate: [authGuard] },

  // Qualquer rota não mapeada cai aqui e redireciona para a raiz
  { path: '**', redirectTo: '' },
];
