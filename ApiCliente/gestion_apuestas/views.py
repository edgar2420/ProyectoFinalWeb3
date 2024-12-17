import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Apuesta
from .serializers import ApuestaSerializer
from .permissions import IsCliente


# VISTA PARA LISTAR DEPORTES DESDE LA API EXTERNA
class ListaDeportesAPIView(APIView):
    permission_classes = [IsCliente]  # Solo clientes autenticados

    def get(self, request):
        url = "http://localhost:8001/api/clientes/deportes/"  # API de Partidos
        auth_header = request.headers.get("Authorization")
        print(f"Token enviado en el header: {auth_header}")  # LOG

        try:
            response = requests.get(url, headers={"Authorization": auth_header})
            print(f"Respuesta de la API externa: {response.status_code}")  # LOG

            if response.status_code == 200:
                return Response(response.json(), status=status.HTTP_200_OK)
            return Response(
                {"error": "Error al obtener deportes"},
                status=response.status_code
            )
        except requests.RequestException as e:
            print(f"Error al conectar con la API de Partidos: {str(e)}")
            return Response(
                {"error": f"Error al conectar con la API de Partidos: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )



# VISTA PARA LISTAR LIGAS POR DEPORTE
class ListaLigasPorDeporteAPIView(APIView):
    permission_classes = [IsCliente]

    def get(self, request, deporte_id):
        url = f"http://localhost:8001/api/clientes/deportes/{deporte_id}/ligas/"
        token = request.headers.get("Authorization")

        try:
            response = requests.get(url, headers={"Authorization": token})
            if response.status_code == 200:
                return Response(response.json(), status=status.HTTP_200_OK)
            return Response(
                {"error": "Error al obtener las ligas de este deporte."},
                status=response.status_code
            )
        except requests.RequestException as e:
            return Response(
                {"error": f"Error al conectar con la API de deportes: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )



# VISTA PARA LISTAR PARTIDOS POR LIGA
class ListaPartidosPorLigaAPIView(APIView):
    permission_classes = [IsCliente]

    def get(self, request, liga_id):
        url = f"http://localhost:8001/api/clientes/ligas/{liga_id}/partidos/"
        token = request.headers.get("Authorization")

        try:
            response = requests.get(url, headers={"Authorization": token})
            if response.status_code == 200:
                return Response(response.json(), status=status.HTTP_200_OK)
            return Response(
                {"error": "Error al obtener los partidos de esta liga."},
                status=response.status_code
            )
        except requests.RequestException as e:
            return Response(
                {"error": f"Error al conectar con la API de deportes: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )



# VISTA PARA LISTAR EVENTOS POR PARTIDO
class ListaEventosPorPartidoAPIView(APIView):
    permission_classes = [IsCliente]

    def get(self, request, partido_id):
        url = f"http://localhost:8001/api/clientes/partidos/{partido_id}/eventos/"
        token = request.headers.get("Authorization")

        try:
            response = requests.get(url, headers={"Authorization": token})
            if response.status_code == 200:
                return Response(response.json(), status=status.HTTP_200_OK)
            return Response(
                {"error": "Error al obtener los eventos de este partido."},
                status=response.status_code
            )
        except requests.RequestException as e:
            return Response(
                {"error": f"Error al conectar con la API de deportes: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )



# VISTA PARA CREAR UNA APUESTA
class ApuestaCreateAPIView(APIView):
    permission_classes = [IsCliente]

    def post(self, request, partido_id):
        # Verificar que el partido existe en la API de Partidos
        url = f"http://localhost:8002/partidos/{partido_id}/"
        try:
            response = requests.get(url)
            if response.status_code != 200:
                return Response(
                    {"error": "El partido no existe en la API de Partidos."},
                    status=status.HTTP_404_NOT_FOUND
                )
        except requests.RequestException as e:
            return Response(
                {"error": f"Error al conectar con la API de Partidos: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Preparar los datos para la apuesta
        data = request.data.copy()
        data['usuario_id'] = request.user.id  # ID del usuario autenticado
        data['partido_id'] = partido_id  # ID del partido validado

        # Serializar y guardar la apuesta
        serializer = ApuestaSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# VISTA PARA OBTENER EL HISTORIAL DE APUESTAS
class ApuestaHistorialAPIView(APIView):
    permission_classes = [IsCliente]

    def get(self, request):
        apuestas = Apuesta.objects.filter(usuario_id=request.user.id)
        serializer = ApuestaSerializer(apuestas, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


