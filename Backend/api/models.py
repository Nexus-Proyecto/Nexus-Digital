from django.db import models

class Producto(models.Model):
    # Definimos los campos básicos para la tabla
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True, null=True)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    
    # Estos campos ayudan a ver cuándo se creó/editó
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'productos' # Así se llamará la tabla en MySQL

    def __str__(self):
        return self.nombre