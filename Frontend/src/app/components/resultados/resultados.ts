import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ProductoService } from '../../core/services/producto.service';
import { Producto } from '../../shared/interfaces/producto.interface';

@Component({
  selector: 'app-resultados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resultados.html',
  styleUrl: './resultados.css',
})
export class Resultados implements OnInit {
  searchQuery: string = '';

  productos: Producto[] = [];
resultados: Producto[] = [];


  constructor(
    private route: ActivatedRoute,
    private productoService: ProductoService
  ) {}

  ngOnInit() {

    this.productoService.getProductos().subscribe({
      next: (productos) => {

        this.productos = productos;

        this.route.queryParams.subscribe(params => {
          this.searchQuery = params['q'] || '';

          this.filtrarProductos();
        });

      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
      }
    });

  }

  filtrarProductos() {

    const texto = this.searchQuery.toLowerCase().trim();

    this.resultados = this.productos.filter(producto =>
      producto.nombre.toLowerCase().includes(texto) ||
      producto.descripcion.toLowerCase().includes(texto)
    );

  }

}