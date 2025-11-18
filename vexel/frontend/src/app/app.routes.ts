import { Routes } from '@angular/router';


import { Login } from './pages/login/login';
import { Vehicles } from './pages/vehicles/vehicles';
import { Reports } from './pages/reports/reports';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: '', redirectTo: 'vehicles', pathMatch: 'full' },
  { path: 'vehicles', component: Vehicles, canActivate: [authGuard] },
  { path: 'reports', component: Reports, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];
