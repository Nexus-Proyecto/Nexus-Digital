export interface DetalleOrden {
  id_detalle: number;
  cantidad: number;
  precio_unitario: number;
  id_orden: number;
  id_producto: number;
  nombre_producto: string;
}

export interface Orden {
  id_orden: number;
  fecha: string | Date;
  total: number;
  id_usuario: number;
  detalles: DetalleOrden[];
}