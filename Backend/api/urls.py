from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    UsuarioViewSet,
    ProductoViewSet,
    CarritoViewSet,
    DetalleCarritoViewSet,
    OrdenCompraViewSet,
    DetalleOrdenViewSet,
)

router = DefaultRouter()
router.register(r'usuarios',        UsuarioViewSet,       basename='usuario')
router.register(r'productos',       ProductoViewSet,      basename='producto')
router.register(r'carritos',        CarritoViewSet,       basename='carrito')
router.register(r'detalle-carrito', DetalleCarritoViewSet, basename='detalle-carrito')
router.register(r'ordenes',         OrdenCompraViewSet,   basename='orden')
router.register(r'detalle-orden',   DetalleOrdenViewSet,  basename='detalle-orden')

urlpatterns = [
    path('', include(router.urls)),
]