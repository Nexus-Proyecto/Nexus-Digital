from rest_framework import permissions


class IsAdminRole(permissions.BasePermission):
    """
    Permite acceso únicamente a usuarios autenticados con rol 'administrador'.
    """

    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            getattr(request.user, 'rol', None) == 'administrador'
        )


class IsVendedorOrReadOnly(permissions.BasePermission):
    """
    Permite lectura pública (GET, HEAD, OPTIONS) del catálogo de productos.
    Para crear, modificar o eliminar productos requiere rol 'vendedor' o 'administrador'.
    Los vendedores solo pueden editar o eliminar sus propios productos.
    """

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(
            request.user and
            request.user.is_authenticated and
            getattr(request.user, 'rol', None) in ['vendedor', 'administrador']
        )

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        if getattr(request.user, 'rol', None) == 'administrador':
            return True
        return getattr(obj, 'id_usuario', None) == request.user


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Permite acceso a un recurso (Carrito u Orden) únicamente a su propietario
    o a un administrador.
    """

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        if getattr(request.user, 'rol', None) == 'administrador':
            return True

        if hasattr(obj, 'id_usuario'):
            return obj.id_usuario == request.user

        if hasattr(obj, 'id_carrito'):
            return obj.id_carrito.id_usuario == request.user

        if hasattr(obj, 'id_orden'):
            return obj.id_orden.id_usuario == request.user

        return False
