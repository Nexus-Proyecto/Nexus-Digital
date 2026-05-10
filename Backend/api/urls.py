from django.urls import path
from .views import ProductoList

urlpatterns = [
    # Esta es tu "Ruta Local" para productos
    path('productos/', ProductoList.as_view(), name='producto-list'),
]