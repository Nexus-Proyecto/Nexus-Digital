from django.urls import path, include
from rest_framework.routers import DefaultRouter
# Importamos ProductoList (que es tu clase) y los ViewSets del equipo
from .views import (
    ProductoList, 
    UsuarioViewSet,
    ProductoViewSet,
    CarritoViewSet,
    DetalleCarritoViewSet,
    OrdenCompraViewSet,
    DetalleOrdenViewSet,
)

# Configuración del Router de tus compañeros
router = DefaultRouter()
router.register(r'usuarios',         UsuarioViewSet,       basename='usuario')
router.register(r'productos-api',    ProductoViewSet,      basename='producto-api') # Le cambié el nombre para que no choque con tu ruta
router.register(r'carritos',         CarritoViewSet,       basename='carrito')
router.register(r'detalle-carrito',  DetalleCarritoViewSet, basename='detalle-carrito')
router.register(r'ordenes',          OrdenCompraViewSet,   basename='orden')
router.register(r'detalle-orden',    DetalleOrdenViewSet,  basename='detalle-orden')

urlpatterns = [
    # 1. TU RUTA DE PRÁCTICA (Donde vas a probar los códigos 200, 201, 404, etc.)
    path('productos/', ProductoList.as_view(), name='producto-list'),

    # 2. LAS RUTAS DEL EQUIPO (Para que el resto del proyecto Nexus funcione)
    path('', include(router.urls)),
]