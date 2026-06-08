import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  resultados: Producto[] = [];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly productoService: ProductoService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['q'] || '';
      this.buscarProductos();
      this.cdr.detectChanges();
    });
  }

  buscarProductos() {
    if (!this.searchQuery.trim()) {
      this.resultados = [];
      this.cdr.detectChanges();
      return;
    }

    this.productoService.buscarPorNombre(this.searchQuery).subscribe({
      next: (data) => {
        this.resultados = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al realizar búsqueda en backend:', err);
      }
    });
  }

  verDetalle(id: number) {
    this.router.navigate(['/producto', id]);
  }
}