from django.contrib import admin
from .models import Usuario, Producto, Carrito, DetalleCarrito, OrdenCompra, DetalleOrden


class DetalleCarritoInline(admin.TabularInline):
    model  = DetalleCarrito
    extra  = 0
    fields = ['id_producto', 'cantidad']


class DetalleOrdenInline(admin.TabularInline):
    model         = DetalleOrden
    extra         = 0
    fields        = ['id_producto', 'cantidad', 'precio_unitario']
    readonly_fields = ['precio_unitario']


@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display  = ['id_usuario', 'nombre', 'apellido', 'email', 'rol']
    list_filter   = ['rol']
    search_fields = ['nombre', 'apellido', 'email']


@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display  = ['id_producto', 'nombre', 'precio', 'stock', 'id_usuario']
    list_filter   = ['id_usuario']
    search_fields = ['nombre']


@admin.register(Carrito)
class CarritoAdmin(admin.ModelAdmin):
    list_display = ['id_carrito', 'id_usuario', 'estado']
    list_filter  = ['estado']
    inlines      = [DetalleCarritoInline]


@admin.register(OrdenCompra)
class OrdenCompraAdmin(admin.ModelAdmin):
    list_display = ['id_orden', 'id_usuario', 'fecha', 'total']
    inlines      = [DetalleOrdenInline]


@admin.register(DetalleCarrito)
class DetalleCarritoAdmin(admin.ModelAdmin):
    list_display = ['id_item', 'id_carrito', 'id_producto', 'cantidad']


@admin.register(DetalleOrden)
class DetalleOrdenAdmin(admin.ModelAdmin):
    list_display = ['id_detalle', 'id_orden', 'id_producto', 'cantidad', 'precio_unitario']