import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../../shared/interfaces/cart-item.interface';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  public cart$ = this.cartSubject.asObservable();

  constructor() {
    this.loadCart();
  }

  private loadCart(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        this.cart = JSON.parse(savedCart);
        this.cartSubject.next([...this.cart]);
      } catch (e) {
        console.error('Error al cargar carrito:', e);
        this.cart = [];
      }
    }
  }

  getCart(): CartItem[] {
    return [...this.cart];
  }

  getCartObservable(): Observable<CartItem[]> {
    return this.cart$;
  }

  addProduct(product: CartItem): void {
    const existingItem = this.cart.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += product.quantity;
    } else {
      this.cart.push({ ...product });
    }
    this.updateCart();
  }

  updateQuantity(id: number, quantity: number): void {
    const item = this.cart.find(item => item.id === id);
    if (item) {
      if (quantity <= 0) {
        this.removeProduct(id);
      } else {
        item.quantity = quantity;
        this.updateCart();
      }
    }
  }

  removeProduct(id: number): void {
    this.cart = this.cart.filter(item => item.id !== id);
    this.updateCart();
  }

  clearCart(): void {
    this.cart = [];
    this.updateCart();
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

  private updateCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.cartSubject.next([...this.cart]);
  }
}