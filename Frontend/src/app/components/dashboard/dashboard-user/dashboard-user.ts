import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-dashboard-user',
  imports: [],
  templateUrl: './dashboard-user.html',
  styleUrl: './dashboard-user.css',
})
export class DashboardUser implements OnInit {
  private readonly authService = inject(AuthService);

  opcionesUsuario: string[] = [];

  ngOnInit(): void {
    const user = this.authService.currentUser();
    const rol = user ? user.rol : 'comprador';

    if (rol === 'vendedor') {
      this.opcionesUsuario = [
        'Mi perfil',
        'Mis ventas',
        'Mis productos (Crear/Eliminar)',
        'Favoritos'
      ];
    } else {
      this.opcionesUsuario = [
        'Mi perfil',
        'Mis compras',
        'Favoritos'
      ];
    }
  }
}
