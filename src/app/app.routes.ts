import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { PublicComponent } from './features/public/public.component';

export const routes: Routes = [
  { path: '', component: PublicComponent },
  { path: 'home', component: HomeComponent },
  { path: 'public', component: PublicComponent },

];
