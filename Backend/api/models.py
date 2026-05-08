from django.db import models


class Usuario(models.Model):
    ROL_CHOICES = [
        ('vendedor', 'Vendedor'),
        ('comprador', 'Comprador'),
        ('administrador', 'Administrador'),
    ]

    id_usuario  = models.AutoField(primary_key=True)
    nombre      = models.CharField(max_length=100)
    apellido    = models.CharField(max_length=100)
    email       = models.EmailField(unique=True)
    password    = models.CharField(max_length=255)
    rol         = models.CharField(max_length=20, choices=ROL_CHOICES, default='comprador')

    class Meta:
        db_table = 'usuario'

    def __str__(self):
        return f"{self.nombre} {self.apellido} ({self.rol})"


class Producto(models.Model):
    id_producto = models.AutoField(primary_key=True)
    nombre      = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True, null=True)
    precio      = models.DecimalField(max_digits=10, decimal_places=2)
    stock       = models.PositiveIntegerField(default=0)
    id_usuario  = models.ForeignKey(
        Usuario,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        db_column='id_usuario',
        related_name='productos',
    )

    class Meta:
        db_table = 'producto'

    def __str__(self):
        return self.nombre


class Carrito(models.Model):
    ESTADO_CHOICES = [
        ('activo',     'Activo'),
        ('pendiente',  'Pendiente'),
        ('abandonado', 'Abandonado'),
    ]

    id_carrito = models.AutoField(primary_key=True)
    id_usuario = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        db_column='id_usuario',
        related_name='carritos',
    )
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='activo')

    class Meta:
        db_table = 'carrito'

    def __str__(self):
        return f"Carrito #{self.id_carrito} — {self.estado}"


class DetalleCarrito(models.Model):
    id_item     = models.AutoField(primary_key=True)
    cantidad    = models.PositiveIntegerField()
    id_carrito  = models.ForeignKey(
        Carrito,
        on_delete=models.CASCADE,
        db_column='id_carrito',
        related_name='detalles',
    )
    id_producto = models.ForeignKey(
        Producto,
        on_delete=models.CASCADE,
        db_column='id_producto',
        related_name='detalles_carrito',
    )

    class Meta:
        db_table = 'detalle_carrito'
        unique_together = ('id_carrito', 'id_producto')

    def __str__(self):
        return f"{self.cantidad}x {self.id_producto.nombre} (Carrito #{self.id_carrito_id})"

    @property
    def subtotal(self):
        return self.cantidad * self.id_producto.precio


class OrdenCompra(models.Model):
    id_orden   = models.AutoField(primary_key=True)
    fecha      = models.DateTimeField(auto_now_add=True)
    total      = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    id_usuario = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        db_column='id_usuario',
        related_name='ordenes',
    )

    class Meta:
        db_table = 'orden_compra'

    def __str__(self):
        return f"Orden #{self.id_orden} — Usuario {self.id_usuario_id}"


class DetalleOrden(models.Model):
    id_detalle      = models.AutoField(primary_key=True)
    cantidad        = models.PositiveIntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    id_orden        = models.ForeignKey(
        OrdenCompra,
        on_delete=models.CASCADE,
        db_column='id_orden',
        related_name='detalles',
    )
    id_producto     = models.ForeignKey(
        Producto,
        on_delete=models.SET_NULL,
        null=True,
        db_column='id_producto',
        related_name='detalles_orden',
    )

    class Meta:
        db_table = 'detalle_orden'

    def __str__(self):
        return f"{self.cantidad}x producto #{self.id_producto_id} (Orden #{self.id_orden_id})"

    @property
    def subtotal(self):
        return self.cantidad * self.precio_unitario