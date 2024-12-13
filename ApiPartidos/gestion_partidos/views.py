from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .permissions import IsAdminPartidos

class TestView(APIView):
    permission_classes = [IsAdminPartidos]

    def get(self, request):
        return Response({"message": "¡Acceso permitido! Eres administrador de partidos."}, status=status.HTTP_200_OK)
