import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductoService } from '../../core/services/producto.service';
import { AuthService } from '../../services/auth.service';
import { Producto } from '../../shared/interfaces/producto.interface';

@Component({
  selector: 'app-vendedor-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vendedor-productos.html',
  styleUrl: './vendedor-productos.css'
})
export class VendedorProductos implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly productoService = inject(ProductoService);
  private readonly router = inject(Router);

  productos: Producto[] = [];
  vendedorId: number | null = null;
  cargando = false;
  guardando = false;

  // Mensajes de feedback
  mensajeExito = '';
  mensajeError = '';

  // Control del modal de formulario
  mostrarModalForm = false;
  modoEdicion = false;
  productoSeleccionado: Producto | null = null;

  formProducto = {
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0
  };

  validationErrors: { [key: string]: string } = {};

  // Control del modal de confirmación de eliminación
  mostrarModalConfirmacion = false;

  // Filtro de búsqueda
  searchQuery = '';

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    if (user.rol !== 'vendedor') {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.vendedorId = user.id_usuario;
    this.cargarProductos();
  }

  /**
   * Carga los productos del vendedor actual
   */
  cargarProductos(): void {
    if (this.vendedorId === null) return;

    this.cargando = true;
    this.productoService.getProductosPorVendedor(this.vendedorId).subscribe({
      next: (data) => {
        this.productos = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar productos del vendedor:', err);
        this.mensajeError = 'No se pudieron cargar los productos. Intenta de nuevo.';
        this.cargando = false;
      }
    });
  }

  /**
   * Filtrado en cliente de los productos cargados
   */
  get productosFiltrados(): Producto[] {
    if (!this.searchQuery.trim()) {
      return this.productos;
    }
    return this.productos.filter(p =>
      p.nombre.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      (p.descripcion && p.descripcion.toLowerCase().includes(this.searchQuery.toLowerCase()))
    );
  }

  // Getters para estadísticas
  get totalProductos(): number {
    return this.productos.length;
  }

  get enStock(): number {
    return this.productos.filter(p => p.stock > 0).length;
  }

  get sinStock(): number {
    return this.productos.filter(p => p.stock === 0).length;
  }

  /**
   * Inicializa el formulario para la creación de un producto
   */
  abrirModalCrear(): void {
    this.modoEdicion = false;
    this.productoSeleccionado = null;
    this.formProducto = {
      nombre: '',
      descripcion: '',
      precio: 0,
      stock: 0
    };
    this.validationErrors = {};
    this.mostrarModalForm = true;
  }

  /**
   * Inicializa el formulario para la edición de un producto existente
   */
  abrirModalEditar(producto: Producto): void {
    this.modoEdicion = true;
    this.productoSeleccionado = producto;
    this.formProducto = {
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      precio: producto.precio,
      stock: producto.stock
    };
    this.validationErrors = {};
    this.mostrarModalForm = true;
  }

  cerrarModalForm(): void {
    this.mostrarModalForm = false;
    this.validationErrors = {};
  }

  /**
   * Valida el formulario localmente
   */
  validarFormulario(): boolean {
    this.validationErrors = {};

    if (!this.formProducto.nombre.trim()) {
      this.validationErrors['nombre'] = 'El nombre del producto es obligatorio.';
    }

    if (this.formProducto.precio <= 0) {
      this.validationErrors['precio'] = 'El precio debe ser mayor a 0.';
    }

    if (this.formProducto.stock < 0) {
      this.validationErrors['stock'] = 'El stock no puede ser un número negativo.';
    }

    return Object.keys(this.validationErrors).length === 0;
  }

  /**
   * Guarda o actualiza el producto actual
   */
  guardarProducto(): void {
    if (!this.validarFormulario()) {
      return;
    }

    this.guardando = true;
    this.mensajeError = '';
    this.mensajeExito = '';

    if (this.modoEdicion && this.productoSeleccionado) {
      // Editar
      const cambios: Partial<Producto> = {
        nombre: this.formProducto.nombre.trim(),
        descripcion: this.formProducto.descripcion.trim(),
        precio: this.formProducto.precio,
        stock: this.formProducto.stock
      };

      this.productoService.actualizarProducto(this.productoSeleccionado.id_producto, cambios).subscribe({
        next: (res) => {
          this.mensajeExito = 'Producto actualizado exitosamente.';
          this.cargarProductos();
          this.cerrarModalForm();
          this.guardando = false;
          this.mostrarMensajeTemporal();
        },
        error: (err) => {
          console.error('Error al editar producto:', err);
          this.mensajeError = 'No se pudo actualizar el producto en el servidor.';
          this.guardando = false;
        }
      });
    } else {
      // Crear nuevo
      const nuevoProducto = {
        nombre: this.formProducto.nombre.trim(),
        descripcion: this.formProducto.descripcion.trim(),
        precio: this.formProducto.precio,
        stock: this.formProducto.stock,
        id_usuario: this.vendedorId!
      };

      this.productoService.crearProducto(nuevoProducto).subscribe({
        next: (res) => {
          this.mensajeExito = 'Producto creado exitosamente.';
          this.cargarProductos();
          this.cerrarModalForm();
          this.guardando = false;
          this.mostrarMensajeTemporal();
        },
        error: (err) => {
          console.error('Error al crear producto:', err);
          this.mensajeError = 'No se pudo guardar el producto en el servidor.';
          this.guardando = false;
        }
      });
    }
  }

  /**
   * Abre modal de confirmación de borrado
   */
  confirmarEliminacion(producto: Producto): void {
    this.productoSeleccionado = producto;
    this.mostrarModalConfirmacion = true;
  }

  cerrarModalConfirmacion(): void {
    this.mostrarModalConfirmacion = false;
    this.productoSeleccionado = null;
  }

  /**
   * Elimina el producto seleccionado
   */
  eliminarProducto(): void {
    if (!this.productoSeleccionado) return;

    this.mensajeError = '';
    this.mensajeExito = '';

    this.productoService.eliminarProducto(this.productoSeleccionado.id_producto).subscribe({
      next: () => {
        this.mensajeExito = 'Producto eliminado exitosamente.';
        this.cargarProductos();
        this.cerrarModalConfirmacion();
        this.mostrarMensajeTemporal();
      },
      error: (err) => {
        console.error('Error al eliminar producto:', err);
        this.mensajeError = 'No se pudo eliminar el producto en el servidor.';
        this.cerrarModalConfirmacion();
      }
    });
  }

  /**
   * Limpia el mensaje de éxito luego de 3 segundos
   */
  mostrarMensajeTemporal(): void {
    setTimeout(() => {
      this.mensajeExito = '';
    }, 4000);
  }

  volverAlDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
