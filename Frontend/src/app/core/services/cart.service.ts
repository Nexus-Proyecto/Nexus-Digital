import { Injectable } from '@angular/core';
import { CartItem } from '../../shared/interfaces/cart-item.interface';

@Injectable({
  providedIn: 'root',
})
export class CartService {

  private cart: CartItem[] = [];

  constructor() {
    const savedCart = localStorage.getItem('cart');

    if (savedCart) {
      this.cart = JSON.parse(savedCart);
    }
  }

  getCart(): CartItem[] {
    return this.cart;
  }

  addProduct(product: CartItem): void {
    this.cart.push(product);
    this.saveCart();
  }

  removeProduct(id: number): void {
    this.cart = this.cart.filter(item => item.id !== id);
    this.saveCart();
  }

  clearCart(): void {
    this.cart = [];
    this.saveCart();
  }

  getTotal(): number {
    return this.cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  getTotalItems(): number {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }

  private saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }
}