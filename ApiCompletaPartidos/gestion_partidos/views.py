from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .permissions import IsAdminPartidos
from .models import Deporte, Liga, Equipo, Partido, Evento
from .serializers import DeporteSerializer, LigaSerializer, EquipoSerializer, PartidoSerializer, EventoSerializer, PartidoUpdateSerializer


class TestView(APIView):
    permission_classes = [IsAdminPartidos]

    def get(self, request):
        return Response({"message": "¡Acceso permitido! Eres administrador de partidos."}, status=status.HTTP_200_OK)


# CRUD para Deportes
class DeporteListCreateAPIView(APIView):
    permission_classes = [IsAdminPartidos]

    def get(self, request):
        deportes = Deporte.objects.all()
        serializer = DeporteSerializer(deportes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = DeporteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeporteDetailAPIView(APIView):
    permission_classes = [IsAdminPartidos]

    def get(self, request, pk):
        try:
            deporte = Deporte.objects.get(pk=pk)
            serializer = DeporteSerializer(deporte)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Deporte.DoesNotExist:
            return Response({"error": "Deporte no encontrado"}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        try:
            deporte = Deporte.objects.get(pk=pk)
            serializer = DeporteSerializer(deporte, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Deporte.DoesNotExist:
            return Response({"error": "Deporte no encontrado"}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        try:
            deporte = Deporte.objects.get(pk=pk)
            deporte.delete()
            return Response({"message": "Deporte eliminado correctamente"}, status=status.HTTP_204_NO_CONTENT)
        except Deporte.DoesNotExist:
            return Response({"error": "Deporte no encontrado"}, status=status.HTTP_404_NOT_FOUND)


# CRUD para Ligas
class LigaListCreateAPIView(APIView):
    permission_classes = [IsAdminPartidos]

    def get(self, request):
        ligas = Liga.objects.all()
        serializer = LigaSerializer(ligas, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = LigaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LigaDetailAPIView(APIView):
    permission_classes = [IsAdminPartidos]

    def get(self, request, pk):
        try:
            liga = Liga.objects.get(pk=pk)
            serializer = LigaSerializer(liga)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Liga.DoesNotExist:
            return Response({"error": "Liga no encontrada"}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        try:
            liga = Liga.objects.get(pk=pk)
            serializer = LigaSerializer(liga, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Liga.DoesNotExist:
            return Response({"error": "Liga no encontrada"}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        try:
            liga = Liga.objects.get(pk=pk)
            liga.delete()
            return Response({"message": "Liga eliminada correctamente"}, status=status.HTTP_204_NO_CONTENT)
        except Liga.DoesNotExist:
            return Response({"error": "Liga no encontrada"}, status=status.HTTP_404_NOT_FOUND)


# CRUD para Partidos
class PartidoListCreateAPIView(APIView):
    permission_classes = [IsAdminPartidos]

    def get(self, request):
        partidos = Partido.objects.all()
        serializer = PartidoSerializer(partidos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = PartidoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PartidoDetailAPIView(APIView):
    permission_classes = [IsAdminPartidos]

    def get(self, request, pk):
        try:
            partido = Partido.objects.get(pk=pk)
            serializer = PartidoSerializer(partido)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Partido.DoesNotExist:
            return Response({"error": "Partido no encontrado"}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        try:
            partido = Partido.objects.get(pk=pk)
            serializer = PartidoUpdateSerializer(partido, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Partido.DoesNotExist:
            return Response({"error": "Partido no encontrado"}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        try:
            partido = Partido.objects.get(pk=pk)
            partido.delete()
            return Response({"message": "Partido eliminado correctamente"}, status=status.HTTP_204_NO_CONTENT)
        except Partido.DoesNotExist:
            return Response({"error": "Partido no encontrado"}, status=status.HTTP_404_NOT_FOUND)


# CRUD para Eventos
class EventoListCreateAPIView(APIView):
    permission_classes = [IsAdminPartidos]

    def get(self, request):
        eventos = Evento.objects.all()
        serializer = EventoSerializer(eventos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = EventoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EventoDetailAPIView(APIView):
    permission_classes = [IsAdminPartidos]

    def get(self, request, pk):
        try:
            evento = Evento.objects.get(pk=pk)
            serializer = EventoSerializer(evento)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Evento.DoesNotExist:
            return Response({"error": "Evento no encontrado"}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        try:
            evento = Evento.objects.get(pk=pk)
            serializer = EventoSerializer(evento, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Evento.DoesNotExist:
            return Response({"error": "Evento no encontrado"}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        try:
            evento = Evento.objects.get(pk=pk)
            evento.delete()
            return Response({"message": "Evento eliminado correctamente"}, status=status.HTTP_204_NO_CONTENT)
        except Evento.DoesNotExist:
            return Response({"error": "Evento no encontrado"}, status=status.HTTP_404_NOT_FOUND)

# CRUD para Equipos
class EquipoListCreateAPIView(APIView):
    permission_classes = [IsAdminPartidos]

    def get(self, request):
        equipos = Equipo.objects.all()
        serializer = EquipoSerializer(equipos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = EquipoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EquipoDetailAPIView(APIView):
    permission_classes = [IsAdminPartidos]

    def get(self, request, pk):
        try:
            equipo = Equipo.objects.get(pk=pk)
            serializer = EquipoSerializer(equipo)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Equipo.DoesNotExist:
            return Response({"error": "Equipo no encontrado"}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        try:
            equipo = Equipo.objects.get(pk=pk)
            serializer = EquipoSerializer(equipo, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Equipo.DoesNotExist:
            return Response({"error": "Equipo no encontrado"}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        try:
            equipo = Equipo.objects.get(pk=pk)
            equipo.delete()
            return Response({"message": "Equipo eliminado correctamente"}, status=status.HTTP_204_NO_CONTENT)
        except Equipo.DoesNotExist:
            return Response({"error": "Equipo no encontrado"}, status=status.HTTP_404_NOT_FOUND)
