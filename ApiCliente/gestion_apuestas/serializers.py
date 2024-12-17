from rest_framework import serializers
from .models import Apuesta

# Serializador para el modelo Apuesta
class ApuestaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Apuesta
        fields = [
            'id',
            'usuario_id',
            'partido_id',
            'monto',
            'resultado_apostado',
            'fecha_apuesta',
            'resultado_real',
            'apuesta_resuelta'
        ]
        read_only_fields = ['id', 'fecha_apuesta', 'usuario_id', 'apuesta_resuelta']

    def validate_monto(self, value):
        """
        Valida que el monto de la apuesta sea mayor que 0.
        """
        if value <= 0:
            raise serializers.ValidationError("El monto de la apuesta debe ser mayor que 0.")
        return value
