import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { AboutUs } from './components/about-us/about-us';
import { MainDashboard } from './components/dashboard/main-dashboard/main-dashboard';
import { Resultados } from './components/resultados/resultados';
import { Registro } from './components/registro/registro';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'quienes-somos', component: AboutUs },
  { path: 'dashboard', component: MainDashboard },
  { path: 'resultados', component: Resultados},
  { path: 'registro', component: Registro }
];
