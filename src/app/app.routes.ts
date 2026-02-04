import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Keep Home eager loaded for improved First Contentful Paint
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent) 
  }
];
