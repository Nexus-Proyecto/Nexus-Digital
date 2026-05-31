import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { CartItem } from '../../shared/interfaces/cart-item.interface';

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
  private apiUrl = 'http://localhost:8000/api'; // AJUSTÁ ESTO con tu backend

  constructor(private http: HttpClient) {}

  createOrder(orderData: OrderData): Observable<any> {
    return this.http.post(`${this.apiUrl}/orders/`, orderData).pipe(
      catchError(error => {
        console.error('Error al crear orden:', error);
        return throwError(() => new Error('No se pudo procesar la compra'));
      })
    );
  }

  getOrderHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/orders/`).pipe(
      catchError(error => {
        console.error('Error al obtener historial:', error);
        return throwError(() => new Error('No se pudo cargar el historial'));
      })
    );
  }
}