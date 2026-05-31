import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { Home } from './components/home/home';
import { AboutUs } from './components/about-us/about-us';
import { MainDashboard } from './components/dashboard/main-dashboard/main-dashboard';
import { Resultados } from './components/resultados/resultados';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'quienes-somos', component: AboutUs },
  { path: 'dashboard', component: MainDashboard },
  { 
    path: 'cart', 
    loadComponent: () => import('./components/cart/cart').then(m => m.Cart)
  },
  { 
    path: 'checkout', 
    canActivate: [authGuard],
    loadComponent: () => import('./components/checkout/checkout.component').then(m => m.CheckoutComponent)
  },
  { 
    path: 'order-summary', 
    canActivate: [authGuard],
    loadComponent: () => import('./components/order-summary/order-summary.component').then(m => m.OrderSummaryComponent)
  },
  { path: 'resultados', component: Resultados}
];
