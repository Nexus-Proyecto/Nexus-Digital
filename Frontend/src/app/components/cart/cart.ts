import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { CartItem } from '../../shared/interfaces/cart-item.interface';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {

  cart: CartItem[] = [];
  message: string = '';

  constructor(private cartService: CartService) {
    this.loadCart();
  }

  loadCart(): void {
    this.cart = this.cartService.getCart();
  }

  remove(id: number): void {
    this.cartService.removeProduct(id);
    this.loadCart();
  }

  getTotal(): number {
    return this.cartService.getTotal();
  }

  getTotalItems(): number {
    return this.cartService.getTotalItems();
  }

confirmPurchase(): void {

  if (this.cart.length === 0) {
    this.message = 'El carrito está vacío';
    return;
  }

  const order = {
    items: this.cartService.getCart(),
    total: this.cartService.getTotal(),
    date: new Date()
  };

  localStorage.setItem('lastOrder', JSON.stringify(order));

  this.cartService.clearCart();
  this.loadCart();

  this.message = 'Compra realizada con éxito ✔';
}
}