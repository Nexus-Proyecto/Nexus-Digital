import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Producto } from '../../shared/interfaces/producto.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/productos-api/`);
  }

  getProductoById(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/productos-api/${id}/`);
  }

  buscarPorNombre(nombre: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/productos-api/?search=${nombre}`);
  }

  filtrarPorRangoPrecio(min: number, max: number): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/productos-api/?precio_min=${min}&precio_max=${max}`);
  }

  ordenarPorPrecio(orden: 'asc' | 'desc'): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/productos-api/?ordering=${orden === 'asc' ? 'precio' : '-precio'}`);
  }
}