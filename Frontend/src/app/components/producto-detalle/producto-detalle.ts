import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // ← para ngModel
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService } from '../../core/services/producto.service';
import { CartService } from '../../core/services/cart.service';  // ← nuevo
import { Producto } from '../../shared/interfaces/producto.interface';

@Component({
  selector: 'app-producto-detalle',
  standalone: true,
  imports: [CommonModule, FormsModule],  
  templateUrl: './producto-detalle.html',
  styleUrl: './producto-detalle.css'
})
export class ProductoDetalle implements OnInit {
  producto: Producto | undefined;
  cantidad: number = 1;  // ← nuevo

  constructor(
    private route: ActivatedRoute,
    private productoService: ProductoService,
    private cartService: CartService,  // ← nuevo
    private router: Router
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productoService.getProductoById(id).subscribe({
      next: (data) => {
        this.producto = data;
      },
      error: (err) => {
        console.error('Error al cargar producto:', err);
      }
    });
  }

  volver() {
    this.router.navigate(['/productos']);
  }

  // ← método nuevo
agregarAlCarrito() {
  if (this.producto) {
    this.cartService.addProduct({
      id: this.producto.id_producto,      
      name: this.producto.nombre,
      price: this.producto.precio,
      quantity: this.cantidad,
      image: ''                           
    });
    this.router.navigate(['/cart']);
  }
}
}