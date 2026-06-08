import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';  
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

  constructor(
    private readonly cartService: CartService, 
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(items => {
      this.cart = items;
      this.cdr.detectChanges();
    });
  }

  loadCart(): void {
    this.cart = this.cartService.getCart();
    this.cdr.detectChanges();
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
    this.cdr.detectChanges();
    setTimeout(() => {
      this.message = '';
      this.cdr.detectChanges();
    }, 2000);
  }

  confirmPurchase(): void {
    if (this.cart.length === 0) {
      this.message = 'El carrito está vacío';
      this.cdr.detectChanges();
      return;
    }
    this.message = '';
    this.cdr.detectChanges();
  }

  goToCheckout(): void {
    console.log('🔴 goToCheckout llamado');
    this.router.navigate(['/checkout']).then(success => {
      console.log('🟢 Navegación:', success ? 'EXITOSA' : 'FALLIDA');
    }).catch(err => {
      console.error('🔴 Error de navegación:', err);
    });
  }
}