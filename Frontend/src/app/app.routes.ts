import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { Home } from './components/home/home';
import { AboutUs } from './components/about-us/about-us';
import { MainDashboard } from './components/dashboard/main-dashboard/main-dashboard';
import { Resultados } from './components/resultados/resultados';
import { Registro } from './components/registro/registro';
import { Login } from './components/login/login';
import { Productos } from './components/productos/productos';
import { ProductoDetalle } from './components/producto-detalle/producto-detalle';
import { Historial } from './components/historial/historial';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'quienes-somos', component: AboutUs },
  { path: 'dashboard', component: MainDashboard },
  {
    path: 'mis-productos',
    canActivate: [authGuard],
    loadComponent: () => import('./components/vendedor-productos/vendedor-productos').then(m => m.VendedorProductos)
  },
  { path: 'resultados', component: Resultados },
  { path: 'registro', component: Registro },
  { path: 'login', component: Login },
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
  { path: 'productos', component: Productos },
  { path: 'producto/:id', component: ProductoDetalle },
  { path: 'historial', canActivate: [authGuard], component: Historial }
];
