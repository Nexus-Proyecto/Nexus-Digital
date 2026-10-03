from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken

from .models import Usuario


class UsuarioJWTAuthentication(JWTAuthentication):

    def get_user(self, validated_token):
        user_id = validated_token.get('user_id')
        if user_id is None:
            raise InvalidToken('El token no contiene user_id.')

        try:
            return Usuario.objects.get(pk=user_id)
        except Usuario.DoesNotExist:
            raise InvalidToken('Usuario no encontrado para este token.')
