import { Component, OnInit, inject, signal, computed } from '@angular/core';
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

  productos = signal<Producto[]>([]);
  vendedorId = signal<number | null>(null);
  cargando = signal(false);
  guardando = signal(false);

  // Mensajes de feedback
  mensajeExito = signal('');
  mensajeError = signal('');

  // Control del modal de formulario
  mostrarModalForm = signal(false);
  modoEdicion = signal(false);
  productoSeleccionado = signal<Producto | null>(null);

  formProducto = {
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0
  };

  validationErrors: { [key: string]: string } = {};

  // Control del modal de confirmación de eliminación
  mostrarModalConfirmacion = signal(false);

  // Filtro de búsqueda
  searchQuery = signal('');

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

    this.vendedorId.set(user.id_usuario);
    this.cargarProductos();
  }

  /**
   * Carga los productos del vendedor actual
   */
  cargarProductos(): void {
    const vId = this.vendedorId();
    if (vId === null) return;

    this.cargando.set(true);
    console.log('DEBUG [VendedorProductos]: Iniciando cargarProductos() para vendedorId:', vId);
    this.productoService.getProductosPorVendedor(vId).subscribe({
      next: (data) => {
        console.log('DEBUG [VendedorProductos]: getProductosPorVendedor exitoso. Datos:', data);
        this.productos.set(data);
        this.cargando.set(false);
        console.log('DEBUG [VendedorProductos]: cargando = false. Cantidad productos:', this.productos().length);
      },
      error: (err) => {
        console.error('DEBUG [VendedorProductos]: Error en getProductosPorVendedor:', err);
        this.mensajeError.set('No se pudieron cargar los productos. Intenta de nuevo.');
        this.cargando.set(false);
      }
    });
  }

  /**
   * Filtrado en cliente de los productos cargados
   */
  readonly productosFiltrados = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const list = this.productos();
    if (!query) {
      return list;
    }
    return list.filter(p =>
      p.nombre.toLowerCase().includes(query) ||
      (p.descripcion && p.descripcion.toLowerCase().includes(query))
    );
  });

  // Getters/Computeds para estadísticas
  readonly totalProductos = computed(() => this.productos().length);
  readonly enStock = computed(() => this.productos().filter(p => p.stock > 0).length);
  readonly sinStock = computed(() => this.productos().filter(p => p.stock === 0).length);

  /**
   * Inicializa el formulario para la creación de un producto
   */
  abrirModalCrear(): void {
    this.modoEdicion.set(false);
    this.productoSeleccionado.set(null);
    this.formProducto = {
      nombre: '',
      descripcion: '',
      precio: 0,
      stock: 0
    };
    this.validationErrors = {};
    this.mostrarModalForm.set(true);
  }

  /**
   * Inicializa el formulario para la edición de un producto existente
   */
  abrirModalEditar(producto: Producto): void {
    this.modoEdicion.set(true);
    this.productoSeleccionado.set(producto);
    this.formProducto = {
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      precio: producto.precio,
      stock: producto.stock
    };
    this.validationErrors = {};
    this.mostrarModalForm.set(true);
  }

  cerrarModalForm(): void {
    this.mostrarModalForm.set(false);
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

    this.guardando.set(true);
    this.mensajeError.set('');
    this.mensajeExito.set('');

    const seleccionado = this.productoSeleccionado();
    if (this.modoEdicion() && seleccionado) {
      // Editar
      const cambios: Partial<Producto> = {
        nombre: this.formProducto.nombre.trim(),
        descripcion: this.formProducto.descripcion.trim(),
        precio: this.formProducto.precio,
        stock: this.formProducto.stock
      };

      this.productoService.actualizarProducto(seleccionado.id_producto, cambios).subscribe({
        next: (res) => {
          this.mensajeExito.set('Producto actualizado exitosamente.');
          this.cargarProductos();
          this.cerrarModalForm();
          this.guardando.set(false);
          this.mostrarMensajeTemporal();
        },
        error: (err) => {
          console.error('Error al editar producto:', err);
          this.mensajeError.set('No se pudo actualizar el producto en el servidor.');
          this.guardando.set(false);
        }
      });
    } else {
      // Crear nuevo
      const nuevoProducto = {
        nombre: this.formProducto.nombre.trim(),
        descripcion: this.formProducto.descripcion.trim(),
        precio: this.formProducto.precio,
        stock: this.formProducto.stock,
        id_usuario: this.vendedorId()!
      };

      console.log('DEBUG [VendedorProductos]: Enviando crearProducto() con:', nuevoProducto);
      this.productoService.crearProducto(nuevoProducto).subscribe({
        next: (res) => {
          console.log('DEBUG [VendedorProductos]: crearProducto exitoso. Respuesta:', res);
          this.mensajeExito.set('Producto creado exitosamente.');
          this.cargarProductos();
          this.cerrarModalForm();
          this.guardando.set(false);
          this.mostrarMensajeTemporal();
        },
        error: (err) => {
          console.error('DEBUG [VendedorProductos]: Error al crear producto:', err);
          this.mensajeError.set('No se pudo guardar el producto en el servidor.');
          this.guardando.set(false);
        }
      });
    }
  }

  /**
   * Abre modal de confirmación de borrado
   */
  confirmarEliminacion(producto: Producto): void {
    this.productoSeleccionado.set(producto);
    this.mostrarModalConfirmacion.set(true);
  }

  cerrarModalConfirmacion(): void {
    this.mostrarModalConfirmacion.set(false);
    this.productoSeleccionado.set(null);
  }

  /**
   * Elimina el producto seleccionado
   */
  eliminarProducto(): void {
    const seleccionado = this.productoSeleccionado();
    if (!seleccionado) return;

    this.mensajeError.set('');
    this.mensajeExito.set('');

    this.productoService.eliminarProducto(seleccionado.id_producto).subscribe({
      next: () => {
        this.mensajeExito.set('Producto eliminado exitosamente.');
        this.cargarProductos();
        this.cerrarModalConfirmacion();
        this.mostrarMensajeTemporal();
      },
      error: (err) => {
        console.error('Error al eliminar producto:', err);
        this.mensajeError.set('No se pudo eliminar el producto en el servidor.');
        this.cerrarModalConfirmacion();
      }
    });
  }

  /**
   * Limpia el mensaje de éxito luego de 3 segundos
   */
  mostrarMensajeTemporal(): void {
    setTimeout(() => {
      this.mensajeExito.set('');
    }, 4000);
  }

  volverAlDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
