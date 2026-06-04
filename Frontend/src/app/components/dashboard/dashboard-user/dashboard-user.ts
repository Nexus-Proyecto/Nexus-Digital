import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-dashboard-user',
  imports: [],
  templateUrl: './dashboard-user.html',
  styleUrl: './dashboard-user.css',
})
export class DashboardUser implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

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

  seleccionarOpcion(opcion: string): void {
    if (opcion === 'Mis productos (Crear/Eliminar)') {
      this.router.navigate(['/mis-productos']);
    } else {
      alert(`La opción "${opcion}" estará disponible próximamente.`);
    }
  }
}
