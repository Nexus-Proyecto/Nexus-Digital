// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable, catchError, throwError } from 'rxjs';
// import { Producto } from '../../shared/interfaces/producto.interface';

// @Injectable({
//   providedIn: 'root'
// })
// export class ProductoService {
//   private apiUrl = 'http://localhost:8000/api';

//   constructor(private http: HttpClient) {}

//   getProductos(): Observable<Producto[]> {
//     return this.http.get<Producto[]>(`${this.apiUrl}/productos-api/`);
//   }

//   getProductoById(id: number): Observable<Producto> {
//     return this.http.get<Producto>(`${this.apiUrl}/productos-api/${id}/`);
//   }

//   buscarPorNombre(nombre: string): Observable<Producto[]> {
//     return this.http.get<Producto[]>(`${this.apiUrl}/productos-api/?search=${nombre}`);
//   }

//   filtrarPorRangoPrecio(min: number, max: number): Observable<Producto[]> {
//     return this.http.get<Producto[]>(`${this.apiUrl}/productos-api/?precio_min=${min}&precio_max=${max}`);
//   }

//   ordenarPorPrecio(orden: 'asc' | 'desc'): Observable<Producto[]> {
//     return this.http.get<Producto[]>(`${this.apiUrl}/productos-api/?ordering=${orden === 'asc' ? 'precio' : '-precio'}`);
//   }
// }

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Producto } from '../../shared/interfaces/producto.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private productos: Producto[] = [
    {
      id_producto: 1,
      nombre: 'Notebook Lenovo',
      descripcion: 'Notebook 15 pulgadas, 16GB RAM, 512GB SSD',
      precio: 850000,
      stock: 5,
      id_usuario: 1
    },
    {
      id_producto: 2,
      nombre: 'Mouse Logitech',
      descripcion: 'Mouse inalámbrico ergonómico',
      precio: 25000,
      stock: 0,
      id_usuario: 1
    },
    {
      id_producto: 3,
      nombre: 'Teclado Redragon',
      descripcion: 'Teclado mecánico RGB',
      precio: 45000,
      stock: 10,
      id_usuario: 2
    },
    {
      id_producto: 4,
      nombre: 'Monitor Samsung',
      descripcion: 'Monitor 24 pulgadas Full HD',
      precio: 320000,
      stock: 3,
      id_usuario: 2
    },
    {
      id_producto: 5,
      nombre: 'Auriculares Sony',
      descripcion: 'Auriculares inalámbricos con cancelación de ruido',
      precio: 180000,
      stock: 7,
      id_usuario: 1
    }
  ];

  getProductos(): Observable<Producto[]> {
    return of(this.productos);
  }

  getProductoById(id: number): Observable<Producto | undefined> {
    return of(this.productos.find(p => p.id_producto === id));
  }

  buscarPorNombre(nombre: string): Observable<Producto[]> {
    return of(this.productos.filter(p =>
      p.nombre.toLowerCase().includes(nombre.toLowerCase())
    ));
  }

  filtrarPorRangoPrecio(min: number, max: number): Observable<Producto[]> {
    return of(this.productos.filter(p => p.precio >= min && p.precio <= max));
  }

  ordenarPorPrecio(orden: 'asc' | 'desc'): Observable<Producto[]> {
    return of([...this.productos].sort((a, b) =>
      orden === 'asc' ? a.precio - b.precio : b.precio - a.precio
    ));
  }
}