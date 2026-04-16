"""
URL configuration for config project.
"""

from django.contrib import admin
from django.urls import path, include  # ← AGREGAR include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),  # ← AGREGAR ESTA LÍNEA
]