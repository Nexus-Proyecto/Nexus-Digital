import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Producto } from '../../shared/interfaces/producto.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://127.0.0.1:8000/api/productos-api';

  // Base de datos simulada en memoria para el modo fallback
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

  /**
   * Obtener todos los productos
   */
  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/`).pipe(
      catchError(err => {
        console.warn('Backend no disponible, usando base de datos simulada (getProductos)', err);
        return of(this.productos);
      })
    );
  }

  /**
   * Obtener productos filtrados por un vendedor específico
   */
  getProductosPorVendedor(vendedorId: number): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/?vendedor=${vendedorId}`).pipe(
      catchError(err => {
        console.warn('Backend no disponible, usando base de datos simulada (getProductosPorVendedor)', err);
        const filtrados = this.productos.filter(p => p.id_usuario === vendedorId);
        return of(filtrados);
      })
    );
  }

  /**
   * Obtener detalle de un producto por ID
   */
  getProductoById(id: number): Observable<Producto | undefined> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}/`).pipe(
      catchError(err => {
        console.warn('Backend no disponible, usando base de datos simulada (getProductoById)', err);
        return of(this.productos.find(p => p.id_producto === id));
      })
    );
  }

  /**
   * Crear un nuevo producto
   */
  crearProducto(producto: Omit<Producto, 'id_producto'>): Observable<Producto> {
    return this.http.post<Producto>(`${this.apiUrl}/`, producto).pipe(
      catchError(err => {
        console.warn('Backend no disponible, simulando creación local', err);
        const nuevoId = this.productos.length > 0 
          ? Math.max(...this.productos.map(p => p.id_producto)) + 1 
          : 1;
        const nuevoProducto: Producto = {
          ...producto,
          id_producto: nuevoId
        };
        this.productos.push(nuevoProducto);
        return of(nuevoProducto);
      })
    );
  }

  /**
   * Actualizar un producto existente
   */
  actualizarProducto(id: number, cambios: Partial<Producto>): Observable<Producto> {
    return this.http.put<Producto>(`${this.apiUrl}/${id}/`, cambios).pipe(
      catchError(err => {
        console.warn('Backend no disponible, simulando actualización local', err);
        const index = this.productos.findIndex(p => p.id_producto === id);
        if (index !== -1) {
          this.productos[index] = {
            ...this.productos[index],
            ...cambios
          };
          return of(this.productos[index]);
        }
        return of({} as Producto);
      })
    );
  }

  /**
   * Eliminar un producto
   */
  eliminarProducto(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}/`).pipe(
      catchError(err => {
        console.warn('Backend no disponible, simulando eliminación local', err);
        this.productos = this.productos.filter(p => p.id_producto !== id);
        return of({ success: true });
      })
    );
  }

  /**
   * Buscar productos por nombre
   */
  buscarPorNombre(nombre: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/?search=${nombre}`).pipe(
      catchError(err => {
        console.warn('Backend no disponible, usando base de datos simulada (buscarPorNombre)', err);
        return of(this.productos.filter(p =>
          p.nombre.toLowerCase().includes(nombre.toLowerCase())
        ));
      })
    );
  }

  /**
   * Filtrar por rango de precio
   */
  filtrarPorRangoPrecio(min: number, max: number): Observable<Producto[]> {
    return of(this.productos.filter(p => p.precio >= min && p.precio <= max));
  }

  /**
   * Ordenar productos por precio
   */
  ordenarPorPrecio(orden: 'asc' | 'desc'): Observable<Producto[]> {
    return of([...this.productos].sort((a, b) =>
      orden === 'asc' ? a.precio - b.precio : b.precio - a.precio
    ));
  }
}