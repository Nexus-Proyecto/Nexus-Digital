import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { CartItem } from '../../shared/interfaces/cart-item.interface';
import { Orden } from '../../shared/interfaces/orden.interface';

export interface OrderData {
  items: CartItem[];
  total: number;
  customer: {
    fullName: string;
    email: string;
    address: string;
    city: string;
    zipCode: string;
    phone: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private readonly http: HttpClient) {}

  /**
   * Confirma la compra de un carrito convirtiéndolo en una orden de compra
   * @param cartId ID del carrito a confirmar
   */
  confirmCart(cartId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/carritos/${cartId}/confirmar/`, {}).pipe(
      catchError(error => {
        console.error('Error al confirmar compra:', error);
        let msg = 'No se pudo procesar la compra';
        if (error.error && error.error.detail) {
          msg = error.error.detail;
        }
        return throwError(() => new Error(msg));
      })
    );
  }

  /**
   * Obtiene el historial de órdenes de un usuario específico
   * @param usuarioId ID del usuario comprador
   */
  getOrderHistory(usuarioId: number): Observable<Orden[]> {
    return this.http.get<Orden[]>(`${this.apiUrl}/ordenes/?usuario=${usuarioId}`).pipe(
      catchError(error => {
        console.error('Error al obtener historial:', error);
        return throwError(() => new Error('No se pudo cargar el historial'));
      })
    );
  }
}