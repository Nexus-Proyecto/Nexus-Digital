import { Injectable, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../../shared/interfaces/cart-item.interface';
import { AuthService } from '../../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  public cart$ = this.cartSubject.asObservable();
  
  private activeCartId: number | null = null;
  private currentUser: any = null;

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService
  ) {
    this.loadCart();

    // Reaccionar reactivamente a cambios en el usuario actual
    effect(() => {
      const user = this.authService.currentUser();
      this.currentUser = user;
      if (user) {
        this.syncWithBackend(user.id_usuario);
      } else {
        this.activeCartId = null;
        this.loadCart(); // Cargar carrito local de invitado
      }
    });
  }

  private loadCart(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        this.cart = JSON.parse(savedCart);
        this.cartSubject.next([...this.cart]);
      } catch (e) {
        console.error('Error al cargar carrito local:', e);
        this.cart = [];
        this.cartSubject.next([]);
      }
    } else {
      this.cart = [];
      this.cartSubject.next([]);
    }
  }

  private syncWithBackend(userId: number): void {
    // Buscar los carritos del usuario
    this.http.get<any[]>(`http://127.0.0.1:8000/api/carritos/?usuario=${userId}`).subscribe({
      next: (carts) => {
        const activeCart = carts.find(c => c.estado === 'activo');
        if (activeCart) {
          this.activeCartId = activeCart.id_carrito;
          this.handleMigrationAndLoad(activeCart);
        } else {
          // Crear un carrito activo nuevo
          this.http.post<any>('http://127.0.0.1:8000/api/carritos/', {
            id_usuario: userId,
            estado: 'activo'
          }).subscribe({
            next: (newCart) => {
              this.activeCartId = newCart.id_carrito;
              this.handleMigrationAndLoad(newCart);
            },
            error: (err) => console.error('Error al crear carrito en backend:', err)
          });
        }
      },
      error: (err) => {
        console.error('Error al obtener carritos, usando local:', err);
        this.loadCart();
      }
    });
  }

  private handleMigrationAndLoad(backendCart: any): void {
    const guestItems = [...this.cart];
    if (guestItems.length > 0) {
      let completed = 0;
      guestItems.forEach(item => {
        const existingBackendItem = backendCart.detalles.find((d: any) => d.id_producto === item.id);
        const finalQty = existingBackendItem ? existingBackendItem.cantidad + item.quantity : item.quantity;

        this.http.post(`http://127.0.0.1:8000/api/carritos/${this.activeCartId}/agregar_item/`, {
          id_carrito: this.activeCartId,
          id_producto: item.id,
          cantidad: finalQty
        }).subscribe({
          next: () => {
            completed++;
            if (completed === guestItems.length) {
              localStorage.removeItem('cart');
              this.loadCartFromBackend();
            }
          },
          error: (err) => {
            console.error('Error al migrar producto:', err);
            completed++;
            if (completed === guestItems.length) {
              localStorage.removeItem('cart');
              this.loadCartFromBackend();
            }
          }
        });
      });
    } else {
      this.loadCartFromBackend(backendCart);
    }
  }

  private loadCartFromBackend(cartData?: any): void {
    if (cartData) {
      this.updateStateFromBackend(cartData);
      return;
    }
    if (!this.activeCartId) return;
    this.http.get<any>(`http://127.0.0.1:8000/api/carritos/${this.activeCartId}/`).subscribe({
      next: (cart) => this.updateStateFromBackend(cart),
      error: (err) => console.error('Error al recargar carrito:', err)
    });
  }

  private updateStateFromBackend(cart: any): void {
    this.cart = cart.detalles.map((d: any) => ({
      id: d.id_producto,
      name: d.producto_nombre,
      price: parseFloat(d.precio_unitario),
      quantity: d.cantidad,
      image: ''
    }));
    this.cartSubject.next([...this.cart]);
  }

  getCart(): CartItem[] {
    return [...this.cart];
  }

  getCartObservable(): Observable<CartItem[]> {
    return this.cart$;
  }

  getActiveCartId(): number | null {
    return this.activeCartId;
  }

  addProduct(product: CartItem): void {
    if (this.currentUser && this.activeCartId) {
      const existingItem = this.cart.find(item => item.id === product.id);
      const finalQty = existingItem ? existingItem.quantity + product.quantity : product.quantity;

      this.http.post(`http://127.0.0.1:8000/api/carritos/${this.activeCartId}/agregar_item/`, {
        id_carrito: this.activeCartId,
        id_producto: product.id,
        cantidad: finalQty
      }).subscribe({
        next: () => this.loadCartFromBackend(),
        error: (err) => console.error('Error al agregar producto en base de datos:', err)
      });
    } else {
      const existingItem = this.cart.find(item => item.id === product.id);
      if (existingItem) {
        existingItem.quantity += product.quantity;
      } else {
        this.cart.push({ ...product });
      }
      this.updateCart();
    }
  }

  updateQuantity(id: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeProduct(id);
      return;
    }
    if (this.currentUser && this.activeCartId) {
      this.http.post(`http://127.0.0.1:8000/api/carritos/${this.activeCartId}/agregar_item/`, {
        id_carrito: this.activeCartId,
        id_producto: id,
        cantidad: quantity
      }).subscribe({
        next: () => this.loadCartFromBackend(),
        error: (err) => console.error('Error al actualizar cantidad en base de datos:', err)
      });
    } else {
      const item = this.cart.find(item => item.id === id);
      if (item) {
        item.quantity = quantity;
        this.updateCart();
      }
    }
  }

  removeProduct(id: number): void {
    if (this.currentUser && this.activeCartId) {
      this.http.delete(`http://127.0.0.1:8000/api/carritos/${this.activeCartId}/quitar_item/${id}/`).subscribe({
        next: () => this.loadCartFromBackend(),
        error: (err) => console.error('Error al eliminar producto en base de datos:', err)
      });
    } else {
      this.cart = this.cart.filter(item => item.id !== id);
      this.updateCart();
    }
  }

  clearCart(): void {
    if (this.currentUser && this.activeCartId) {
      this.http.post(`http://127.0.0.1:8000/api/carritos/${this.activeCartId}/vaciar/`, {}).subscribe({
        next: () => this.loadCartFromBackend(),
        error: (err) => console.error('Error al vaciar carrito en base de datos:', err)
      });
    } else {
      this.cart = [];
      this.updateCart();
    }
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