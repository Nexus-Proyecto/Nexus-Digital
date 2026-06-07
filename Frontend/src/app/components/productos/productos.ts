import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '../../core/services/producto.service';
import { Producto } from '../../shared/interfaces/producto.interface';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.html',
  styleUrl: './productos.css'
})
export class Productos implements OnInit {
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  precioMin: number = 0;
  precioMax: number = 999999;
  ordenPrecio: 'asc' | 'desc' = 'asc';

  constructor(
    private readonly productoService: ProductoService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.productoService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.productosFiltrados = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
      }
    });
  }

  aplicarFiltros() {
    this.productosFiltrados = this.productos
      .filter(p => p.precio >= this.precioMin && p.precio <= this.precioMax)
      .sort((a, b) => this.ordenPrecio === 'asc' ? a.precio - b.precio : b.precio - a.precio);
  }

  verDetalle(id: number) {
    this.router.navigate(['/producto', id]);
  }
}