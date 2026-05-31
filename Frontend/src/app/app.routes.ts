import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { AboutUs } from './components/about-us/about-us';
import { MainDashboard } from './components/dashboard/main-dashboard/main-dashboard';
import { Cart } from './components/cart/cart';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'quienes-somos', component: AboutUs },
  { path: 'dashboard', component: MainDashboard },
  { path: 'cart', component: Cart }
];