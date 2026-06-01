import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { 
  FormBuilder, 
  FormGroup, 
  Validators, 
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors 
} from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { OrderService, OrderData } from '../../core/services/order.service';
import { CartItem } from '../../shared/interfaces/cart-item.interface';

function phoneValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value?.toString().replace(/\D/g, '');
  if (!value || value.length < 10) {
    return { invalidPhone: true };
  }
  return null;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cartItems: CartItem[] = [];
  total: number = 0;
  checkoutForm: FormGroup;
  submitted = false;
  loading = false;
  orderSuccess = false;
  errorMessage = '';

  constructor(
    private cartService: CartService,
    private fb: FormBuilder,
    private router: Router,
    private orderService: OrderService
  ) {
    this.checkoutForm = this.fb.group({
      fullName: ['', [
        Validators.required, 
        Validators.minLength(3),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      ]],
      email: ['', [
        Validators.required, 
        Validators.email
      ]],
      address: ['', [
        Validators.required, 
        Validators.minLength(5),
        Validators.maxLength(100)
      ]],
      city: ['', [
        Validators.required,
        Validators.minLength(2)
      ]],
      zipCode: ['', [
        Validators.required, 
        Validators.pattern(/^\d{4}$/)
      ]],
      phone: ['', [
        Validators.required,
        phoneValidator
      ]]
    });
  }

  ngOnInit(): void {
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
      this.total = this.cartService.getTotal();
    });

    if (this.cartItems.length === 0) {
      this.router.navigate(['/cart']);
    }
  }

  get f() {
    return this.checkoutForm.controls;
  }

  getErrorMessage(controlName: string): string {
    const control = this.f[controlName];
    if (control.errors?.['required']) return 'Este campo es obligatorio';
    if (control.errors?.['email']) return 'Email inválido';
    if (control.errors?.['minlength']) return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;
    if (control.errors?.['maxlength']) return `Máximo ${control.errors['maxlength'].requiredLength} caracteres`;
    if (control.errors?.['pattern']) {
      if (controlName === 'zipCode') return 'Debe tener 4 dígitos';
      if (controlName === 'fullName') return 'Solo letras y espacios';
    }
    if (control.errors?.['invalidPhone']) return 'Teléfono inválido (mínimo 10 dígitos)';
    return 'Campo inválido';
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.checkoutForm.invalid) {
      return;
    }

    this.loading = true;

    const orderData: OrderData = {
      items: this.cartItems,
      total: this.total,
      customer: this.checkoutForm.value
    };

    this.orderService.createOrder(orderData).subscribe({
      next: (response) => {
        this.loading = false;
        this.orderSuccess = true;
        this.cartService.clearCart();
        
        setTimeout(() => {
          this.router.navigate(['/order-summary'], {
            state: { order: orderData, orderId: response.id }
          });
        }, 2000);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.message || 'Error al procesar la compra';
      }
    });
  }
}