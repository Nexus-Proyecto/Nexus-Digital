import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { DashboardAdmin } from '../dashboard-admin/dashboard-admin';
import { DashboardUser } from '../dashboard-user/dashboard-user';

@Component({
  selector: 'app-main-dashboard',
  imports: [
    DashboardAdmin,
    DashboardUser
  ],
  templateUrl: './main-dashboard.html',
  styleUrl: './main-dashboard.css',
})
export class MainDashboard implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  rol = 'Usuario';

  ngOnInit(): void {
    const user = this.authService.currentUser();
    
    // Si no está logueado, redirigir al login
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    // Configurar rol para renderizado condicional
    this.rol = user.rol === 'administrador' ? 'Admin' : 'Usuario';
  }
}