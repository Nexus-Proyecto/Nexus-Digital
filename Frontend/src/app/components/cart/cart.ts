import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';  // ← Agregué Router
import { CartService } from '../../core/services/cart.service';
import { CartItem } from '../../shared/interfaces/cart-item.interface';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class Cart implements OnInit {
  cart: CartItem[] = [];
  message: string = '';

  // ← Agregué private router: Router acá
  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(items => {
      this.cart = items;
    });
  }

  loadCart(): void {
    this.cart = this.cartService.getCart();
  }

  updateQuantity(id: number, quantity: number): void {
    this.cartService.updateQuantity(id, quantity);
  }

  remove(id: number): void {
    this.cartService.removeProduct(id);
  }

  getTotal(): number {
    return this.cartService.getTotal();
  }

  getTotalItems(): number {
    return this.cartService.getTotalItems();
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.message = 'Carrito vaciado';
    setTimeout(() => this.message = '', 2000);
  }

  confirmPurchase(): void {
    if (this.cart.length === 0) {
      this.message = 'El carrito está vacío';
      return;
    }
    this.message = '';
  }

  // ← Método nuevo para debuggear
  goToCheckout(): void {
    console.log('🔴 goToCheckout llamado');
    this.router.navigate(['/checkout']).then(success => {
      console.log('🟢 Navegación:', success ? 'EXITOSA' : 'FALLIDA');
    }).catch(err => {
      console.error('🔴 Error de navegación:', err);
    });
  }
}