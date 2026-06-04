import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../core/services/order.service';
import { Orden } from '../../shared/interfaces/orden.interface'
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial.html',
  styleUrl: './historial.css',
})
export class Historial implements OnInit {
  ordenes: Orden[] = [];
  ordenSeleccionada: Orden | null = null;

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    // Cuando carga el componente, pedimos el historial
    this.cargarHistorial();
  }

  cargarHistorial(): void {
    this.orderService.getOrderHistory().subscribe({
      next: (res) => {
        this.ordenes = res; // Llenamos la lista
      },
      error: (err) => {
        console.error('Error al traer el historial', err);
      }
    });
  }

  // Lógica para CA-02: Al hacer clic, mostramos el detalle
  verDetalle(orden: Orden): void {
    this.ordenSeleccionada = orden;
  }

  // Para cerrar el detalle si lo desea
  cerrarDetalle(): void {
    this.ordenSeleccionada = null;
  }

}
