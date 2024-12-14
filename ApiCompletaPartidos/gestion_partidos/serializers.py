from rest_framework import serializers
from .models import Deporte, Liga, Equipo, Partido, Evento
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


# Serializer para el modelo Deporte
class DeporteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Deporte
        fields = '__all__'  # Incluye todos los campos del modelo


# Serializer para el modelo Liga
class LigaSerializer(serializers.ModelSerializer):
    deporte = serializers.StringRelatedField()  # Muestra el nombre del deporte en lugar del ID
    deporte_id = serializers.PrimaryKeyRelatedField(
        queryset=Deporte.objects.all(),
        source='deporte',  # Relaciona con el campo 'deporte'
        write_only=True
    )

    class Meta:
        model = Liga
        fields = ['id', 'nombre', 'deporte', 'deporte_id', 'logo']


# Serializer para el modelo Equipo
class EquipoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipo
        fields = '__all__'


class PartidoSerializer(serializers.ModelSerializer):
    liga = serializers.CharField(source="liga.nombre", read_only=True)  # Nombre de la liga
    liga_id = serializers.PrimaryKeyRelatedField(
        queryset=Liga.objects.all(),
        source="liga",  # Para enviar el ID de la liga
        write_only=True
    )
    equipo_local = serializers.CharField(source="equipo_local.nombre", read_only=True)  # Nombre del equipo local
    equipo_local_id = serializers.PrimaryKeyRelatedField(
        queryset=Equipo.objects.all(),
        source="equipo_local",  # Para enviar el ID del equipo local
        write_only=True
    )
    equipo_visitante = serializers.CharField(source="equipo_visitante.nombre", read_only=True)  # Nombre del equipo visitante
    equipo_visitante_id = serializers.PrimaryKeyRelatedField(
        queryset=Equipo.objects.all(),
        source="equipo_visitante",  # Para enviar el ID del equipo visitante
        write_only=True
    )
    equipo_local_logo = serializers.SerializerMethodField()  # URL del logo del equipo local
    equipo_visitante_logo = serializers.SerializerMethodField()  # URL del logo del equipo visitante

    class Meta:
        model = Partido
        fields = [
            "id",
            "liga",
            "liga_id",  # Incluye ID para operaciones de escritura
            "equipo_local",
            "equipo_local_id",  # Incluye ID para operaciones de escritura
            "equipo_visitante",
            "equipo_visitante_id",  # Incluye ID para operaciones de escritura
            "equipo_local_logo",  # URL del logo del equipo local
            "equipo_visitante_logo",  # URL del logo del equipo visitante
            "fecha",
            "marcador_local",
            "marcador_visitante",
        ]

    def get_equipo_local_logo(self, obj):
        """Obtiene la URL del logo del equipo local"""
        if obj.equipo_local and obj.equipo_local.logo:
            request = self.context.get("request")
            return request.build_absolute_uri(obj.equipo_local.logo.url) if request else obj.equipo_local.logo.url
        return None

    def get_equipo_visitante_logo(self, obj):
        """Obtiene la URL del logo del equipo visitante"""
        if obj.equipo_visitante and obj.equipo_visitante.logo:
            request = self.context.get("request")
            return request.build_absolute_uri(obj.equipo_visitante.logo.url) if request else obj.equipo_visitante.logo.url
        return None


# Serializer para actualizar el partido
class PartidoUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partido
        fields = ["fecha", "marcador_local", "marcador_visitante"]  # Asegúrate de incluir estos campos

# APIView para detalles y actualización del partido
class PartidoDetailAPIView(APIView):
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



# Serializer para el modelo Evento
class EventoSerializer(serializers.ModelSerializer):
    partido = serializers.StringRelatedField()  # Muestra una descripción del partido
    partido_id = serializers.PrimaryKeyRelatedField(
        queryset=Partido.objects.all(),
        source='partido',  # Relaciona con el campo 'partido'
        write_only=True
    )
    equipo = serializers.StringRelatedField()  # Muestra el nombre del equipo relacionado
    equipo_id = serializers.PrimaryKeyRelatedField(
        queryset=Equipo.objects.all(),
        source='equipo',  # Relaciona con el campo 'equipo'
        write_only=True
    )

    class Meta:
        model = Evento
        fields = [
            'id', 'partido', 'partido_id', 'descripcion', 'minuto', 'equipo', 'equipo_id'
        ]
