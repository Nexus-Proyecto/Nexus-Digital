from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Producto # Importamos el modelo
from .serializers import ProductoSerializer # Importamos el serializer

class ProductoList(APIView):
    def get(self, request):
        # Lógica para obtener productos de la DB
        productos = Producto.objects.all()
        serializer = ProductoSerializer(productos, many=True)
        # 200 OK: Éxito al leer
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ProductoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            # 201 CREATED: Éxito al crear
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        # 400 BAD REQUEST: Error de validación (ej. falta el precio)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)