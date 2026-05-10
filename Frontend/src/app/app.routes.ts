import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { AboutUs } from './components/about-us/about-us';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'quienes-somos', component: AboutUs }
];
