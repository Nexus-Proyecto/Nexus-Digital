from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Usuario, Producto, Carrito, DetalleCarrito, OrdenCompra, DetalleOrden
from .serializers import (
    UsuarioSerializer, UsuarioCreateSerializer,
    ProductoSerializer,
    CarritoSerializer, DetalleCarritoSerializer,
    OrdenCompraSerializer, DetalleOrdenSerializer,
)


class UsuarioViewSet(viewsets.ModelViewSet):
    """
    CRUD completo para Usuario.

    GET    /api/usuarios/          → listar
    POST   /api/usuarios/          → crear (requiere password + password_confirm)
    GET    /api/usuarios/{id}/     → detalle
    PUT    /api/usuarios/{id}/     → actualizar completo
    PATCH  /api/usuarios/{id}/     → actualizar parcial
    DELETE /api/usuarios/{id}/     → eliminar
    """
    queryset = Usuario.objects.all()

    def get_serializer_class(self):
        if self.action == 'create':
            return UsuarioCreateSerializer
        return UsuarioSerializer


class ProductoViewSet(viewsets.ModelViewSet):
    """
    CRUD completo para Producto.

    GET    /api/productos/              → listar todos
    POST   /api/productos/              → crear producto
    GET    /api/productos/{id}/         → detalle
    PUT    /api/productos/{id}/         → actualizar completo
    PATCH  /api/productos/{id}/         → actualizar parcial
    DELETE /api/productos/{id}/         → eliminar
    GET    /api/productos/?search=term  → filtrar por nombre
    GET    /api/productos/?vendedor=id  → filtrar por vendedor
    """
    queryset = Producto.objects.select_related('id_usuario').all()
    serializer_class = ProductoSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        search   = self.request.query_params.get('search')
        vendedor = self.request.query_params.get('vendedor')
        if search:
            qs = qs.filter(nombre__icontains=search)
        if vendedor:
            qs = qs.filter(id_usuario=vendedor)
        return qs


class CarritoViewSet(viewsets.ModelViewSet):
    """
    CRUD completo para Carrito.

    GET    /api/carritos/                            → listar
    POST   /api/carritos/                            → crear
    GET    /api/carritos/{id}/                       → detalle con items y total
    PUT    /api/carritos/{id}/                       → actualizar
    PATCH  /api/carritos/{id}/                       → actualizar parcial
    DELETE /api/carritos/{id}/                       → eliminar

    Acciones extra:
    POST   /api/carritos/{id}/agregar_item/          → agregar/actualizar producto
    DELETE /api/carritos/{id}/quitar_item/{prod_id}/ → quitar producto
    POST   /api/carritos/{id}/vaciar/                → vaciar carrito
    POST   /api/carritos/{id}/confirmar/             → generar OrdenCompra
    """
    queryset = Carrito.objects.select_related('id_usuario').prefetch_related(
        'detalles__id_producto'
    ).all()
    serializer_class = CarritoSerializer

    @action(detail=True, methods=['post'], url_path='agregar_item')
    def agregar_item(self, request, pk=None):
        """Agrega un producto al carrito o actualiza su cantidad."""
        carrito = self.get_object()
        serializer = DetalleCarritoSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        producto = serializer.validated_data['id_producto']
        cantidad = serializer.validated_data['cantidad']

        item, created = DetalleCarrito.objects.get_or_create(
            id_carrito=carrito,
            id_producto=producto,
            defaults={'cantidad': cantidad},
        )
        if not created:
            item.cantidad = cantidad
            item.save()

        return Response(DetalleCarritoSerializer(item).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['delete'], url_path=r'quitar_item/(?P<prod_id>\d+)')
    def quitar_item(self, request, pk=None, prod_id=None):
        """Elimina un producto específico del carrito."""
        carrito = self.get_object()
        item = get_object_or_404(DetalleCarrito, id_carrito=carrito, id_producto_id=prod_id)
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['post'])
    def vaciar(self, request, pk=None):
        """Elimina todos los items del carrito."""
        carrito = self.get_object()
        carrito.detalles.all().delete()
        return Response({'detail': 'Carrito vaciado.'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def confirmar(self, request, pk=None):
        """
        Convierte el carrito en una OrdenCompra.
        - Valida stock de cada item.
        - Crea la orden y sus DetalleOrden.
        - Descuenta stock.
        - Marca el carrito como 'pendiente'.
        """
        carrito = self.get_object()
        items   = carrito.detalles.select_related('id_producto').all()

        if not items.exists():
            return Response(
                {'detail': 'El carrito está vacío.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Validar stock
        for item in items:
            if item.cantidad > item.id_producto.stock:
                return Response(
                    {'detail': f"Stock insuficiente para '{item.id_producto.nombre}'. "
                               f"Disponible: {item.id_producto.stock}"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        # Crear orden
        total = sum(item.subtotal for item in items)
        orden = OrdenCompra.objects.create(
            id_usuario=carrito.id_usuario,
            total=total,
        )

        # Crear detalles y descontar stock
        for item in items:
            DetalleOrden.objects.create(
                id_orden=orden,
                id_producto=item.id_producto,
                cantidad=item.cantidad,
                precio_unitario=item.id_producto.precio,
            )
            item.id_producto.stock -= item.cantidad
            item.id_producto.save()

        carrito.estado = 'pendiente'
        carrito.save()

        return Response(OrdenCompraSerializer(orden).data, status=status.HTTP_201_CREATED)


class DetalleCarritoViewSet(viewsets.ModelViewSet):
    """
    CRUD completo para DetalleCarrito.

    GET    /api/detalle-carrito/       → listar
    POST   /api/detalle-carrito/       → crear
    GET    /api/detalle-carrito/{id}/  → detalle
    PUT    /api/detalle-carrito/{id}/  → actualizar
    PATCH  /api/detalle-carrito/{id}/  → actualizar parcial
    DELETE /api/detalle-carrito/{id}/  → eliminar
    """
    queryset = DetalleCarrito.objects.select_related('id_carrito', 'id_producto').all()
    serializer_class = DetalleCarritoSerializer


class OrdenCompraViewSet(viewsets.ModelViewSet):
    """
    CRUD completo para OrdenCompra.

    GET    /api/ordenes/       → listar todas
    POST   /api/ordenes/       → crear manualmente
    GET    /api/ordenes/{id}/  → detalle con items
    PATCH  /api/ordenes/{id}/  → actualizar
    DELETE /api/ordenes/{id}/  → eliminar
    GET    /api/ordenes/?usuario=id → filtrar por usuario
    """
    queryset = OrdenCompra.objects.select_related('id_usuario').prefetch_related(
        'detalles__id_producto'
    ).all()
    serializer_class = OrdenCompraSerializer

    def get_queryset(self):
        qs      = super().get_queryset()
        usuario = self.request.query_params.get('usuario')
        if usuario:
            qs = qs.filter(id_usuario=usuario)
        return qs


class DetalleOrdenViewSet(viewsets.ModelViewSet):
    """
    CRUD completo para DetalleOrden.

    GET    /api/detalle-orden/       → listar
    POST   /api/detalle-orden/       → crear
    GET    /api/detalle-orden/{id}/  → detalle
    PUT    /api/detalle-orden/{id}/  → actualizar
    PATCH  /api/detalle-orden/{id}/  → actualizar parcial
    DELETE /api/detalle-orden/{id}/  → eliminar
    """
    queryset = DetalleOrden.objects.select_related('id_orden', 'id_producto').all()
    serializer_class = DetalleOrdenSerializer