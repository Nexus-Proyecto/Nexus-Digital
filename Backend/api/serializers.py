from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import Usuario, Producto, Carrito, DetalleCarrito, OrdenCompra, DetalleOrden


# ─────────────────────────────────────────
#  USUARIO
# ─────────────────────────────────────────

class UsuarioSerializer(serializers.ModelSerializer):
    """Lectura: nunca expone el password."""

    class Meta:
        model  = Usuario
        fields = ['id_usuario', 'nombre', 'apellido', 'email', 'rol']


class UsuarioCreateSerializer(serializers.ModelSerializer):
    """Creación/registro: acepta password en texto plano y lo hashea."""
    password         = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model  = Usuario
        fields = ['id_usuario', 'nombre', 'apellido', 'email', 'password', 'password_confirm', 'rol']

    def validate_email(self, value):
        if Usuario.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                'El email ya está registrado.'
            )
        return value

    def validate(self, data):
        if data['password'] != data.pop('password_confirm'):
            raise serializers.ValidationError({'password': 'Las contraseñas no coinciden.'})
        return data

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)


# ─────────────────────────────────────────
#  PRODUCTO
# ─────────────────────────────────────────

class ProductoSerializer(serializers.ModelSerializer):
    vendedor_nombre = serializers.SerializerMethodField()
    precio = serializers.FloatField()
    class Meta:
        model  = Producto
        fields = [
            'id_producto', 'nombre', 'descripcion',
            'precio', 'stock', 'id_usuario', 'vendedor_nombre',
        ]

    def get_vendedor_nombre(self, obj):
        if obj.id_usuario:
            return f"{obj.id_usuario.nombre} {obj.id_usuario.apellido}"
        return None

    def validate_precio(self, value):
        if value <= 0:
            raise serializers.ValidationError('El precio debe ser mayor a 0.')
        return value

    def validate_stock(self, value):
        if value < 0:
            raise serializers.ValidationError('El stock no puede ser negativo.')
        return value


# ─────────────────────────────────────────
#  DETALLE CARRITO
# ─────────────────────────────────────────

class DetalleCarritoSerializer(serializers.ModelSerializer):
    subtotal        = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    producto_nombre = serializers.CharField(source='id_producto.nombre', read_only=True)
    precio_unitario = serializers.DecimalField(
        source='id_producto.precio', max_digits=10, decimal_places=2, read_only=True
    )

    class Meta:
        model  = DetalleCarrito
        fields = [
            'id_item', 'id_carrito', 'id_producto',
            'producto_nombre', 'precio_unitario', 'cantidad', 'subtotal',
        ]

    def validate(self, data):
        producto = data.get('id_producto')
        cantidad = data.get('cantidad', 1)
        if producto and cantidad > producto.stock:
            raise serializers.ValidationError(
                {'cantidad': f'Stock insuficiente. Disponible: {producto.stock}'}
            )
        return data


# ─────────────────────────────────────────
#  CARRITO
# ─────────────────────────────────────────

class CarritoSerializer(serializers.ModelSerializer):
    detalles        = DetalleCarritoSerializer(many=True, read_only=True)
    total           = serializers.SerializerMethodField()
    usuario_nombre  = serializers.SerializerMethodField()

    class Meta:
        model  = Carrito
        fields = ['id_carrito', 'id_usuario', 'usuario_nombre', 'estado', 'detalles', 'total']

    def get_total(self, obj):
        return sum(d.subtotal for d in obj.detalles.all())

    def get_usuario_nombre(self, obj):
        return f"{obj.id_usuario.nombre} {obj.id_usuario.apellido}"


# ─────────────────────────────────────────
#  DETALLE ORDEN
# ─────────────────────────────────────────

class DetalleOrdenSerializer(serializers.ModelSerializer):
    subtotal        = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    producto_nombre = serializers.CharField(source='id_producto.nombre', read_only=True)

    class Meta:
        model  = DetalleOrden
        fields = [
            'id_detalle', 'id_orden', 'id_producto',
            'producto_nombre', 'cantidad', 'precio_unitario', 'subtotal',
        ]
        read_only_fields = ['precio_unitario']


# ─────────────────────────────────────────
#  ORDEN COMPRA
# ─────────────────────────────────────────

class OrdenCompraSerializer(serializers.ModelSerializer):
    detalles       = DetalleOrdenSerializer(many=True, read_only=True)
    usuario_nombre = serializers.SerializerMethodField()

    class Meta:
        model  = OrdenCompra
        fields = ['id_orden', 'id_usuario', 'usuario_nombre', 'fecha', 'total', 'detalles']
        read_only_fields = ['fecha', 'total']

    def get_usuario_nombre(self, obj):
        return f"{obj.id_usuario.nombre} {obj.id_usuario.apellido}"
    
    

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()