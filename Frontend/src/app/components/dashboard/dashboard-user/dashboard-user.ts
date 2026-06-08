import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

export interface OpcionDashboard {
  titulo: string;
  descripcion: string;
  icono: string;
  colorClass: string;
}

@Component({
  selector: 'app-dashboard-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-user.html',
  styleUrl: './dashboard-user.css',
})
export class DashboardUser implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  opcionesUsuario: OpcionDashboard[] = [];

  ngOnInit(): void {
    const user = this.authService.currentUser();
    const rol = user ? user.rol : 'comprador';

    if (rol === 'vendedor') {
      this.opcionesUsuario = [
        {
          titulo: 'Mi perfil',
          descripcion: 'Ver y actualizar tu información personal y datos de contacto.',
          icono: 'person',
          colorClass: 'card-perfil'
        },
        {
          titulo: 'Mis ventas',
          descripcion: 'Monitorear el estado de tus ventas y tus ingresos recibidos.',
          icono: 'monetization_on',
          colorClass: 'card-ventas'
        },
        {
          titulo: 'Mis productos (Crear/Eliminar)',
          descripcion: 'Gestionar, crear, editar o eliminar tus productos de la tienda.',
          icono: 'storefront',
          colorClass: 'card-productos'
        },
        {
          titulo: 'Favoritos',
          descripcion: 'Explorar tus productos favoritos y agregados a tu lista de deseos.',
          icono: 'favorite',
          colorClass: 'card-favoritos'
        }
      ];
    } else {
      this.opcionesUsuario = [
        {
          titulo: 'Mi perfil',
          descripcion: 'Ver y actualizar tu información personal y datos de contacto.',
          icono: 'person',
          colorClass: 'card-perfil'
        },
        {
          titulo: 'Mis compras',
          descripcion: 'Ver el historial y estado de todas tus compras y pedidos.',
          icono: 'local_mall',
          colorClass: 'card-compras'
        },
        {
          titulo: 'Favoritos',
          descripcion: 'Explorar tus productos favoritos y agregados a tu lista de deseos.',
          icono: 'favorite',
          colorClass: 'card-favoritos'
        }
      ];
    }
  }

  seleccionarOpcion(opcion: OpcionDashboard): void {
    if (opcion.titulo === 'Mis productos (Crear/Eliminar)') {
      this.router.navigate(['/mis-productos']);
    } else if (opcion.titulo === 'Mis compras') {
      this.router.navigate(['/historial']);
    } else {
      alert(`La opción "${opcion.titulo}" estará disponible próximamente.`);
    }
  }
}
