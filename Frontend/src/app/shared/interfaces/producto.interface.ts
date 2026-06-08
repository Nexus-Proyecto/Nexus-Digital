export interface Producto {
  id_producto: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  id_usuario: number;
  disponibilidad?: string;
  estado_stock?: string;
}