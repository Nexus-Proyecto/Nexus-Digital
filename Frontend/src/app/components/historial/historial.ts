import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../services/auth.service';
import { Orden } from '../../shared/interfaces/orden.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial.html',
  styleUrl: './historial.css',
})
export class Historial implements OnInit {
  private readonly orderService = inject(OrderService);
  private readonly authService = inject(AuthService);
  private readonly cdr = inject(ChangeDetectorRef);

  ordenes: Orden[] = [];
  ordenSeleccionada: Orden | null = null;

  ngOnInit(): void {
    this.cargarHistorial();
  }

  cargarHistorial(): void {
    const user = this.authService.currentUser();
    if (!user) {
      console.warn('No hay usuario logueado para cargar el historial de compras.');
      return;
    }

    this.orderService.getOrderHistory(user.id_usuario).subscribe({
      next: (res) => {
        this.ordenes = res;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al traer el historial', err);
        this.cdr.detectChanges();
      }
    });
  }

  verDetalle(orden: Orden): void {
    this.ordenSeleccionada = orden;
    this.cdr.detectChanges();
  }

  cerrarDetalle(): void {
    this.ordenSeleccionada = null;
    this.cdr.detectChanges();
  }
}
