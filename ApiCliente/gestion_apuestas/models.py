from django.db import models

# Modelo de Apuesta
class Apuesta(models.Model):
    RESULTADO_CHOICES = [
        ('local', 'Gana Local'),
        ('visitante', 'Gana Visitante'),
        ('empate', 'Empate'),
    ]

    usuario_id = models.IntegerField(help_text="ID del usuario que realizó la apuesta")
    partido_id = models.IntegerField(help_text="ID del partido desde la API de Partidos")
    monto = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="Monto de la apuesta"
    )
    resultado_apostado = models.CharField(
        max_length=10,
        choices=RESULTADO_CHOICES,
        help_text="Resultado al que el usuario apostó"
    )
    fecha_apuesta = models.DateTimeField(
        auto_now_add=True,
        help_text="Fecha y hora de la apuesta"
    )
    resultado_real = models.CharField(
        max_length=10,
        choices=RESULTADO_CHOICES,
        null=True,
        blank=True,
        help_text="Resultado real del partido"
    )
    apuesta_resuelta = models.BooleanField(
        default=False,
        help_text="Indica si la apuesta ya fue resuelta"
    )

    class Meta:
        verbose_name = "Apuesta"
        verbose_name_plural = "Apuestas"
        ordering = ['-fecha_apuesta']

    def __str__(self):
        return f"Apuesta de usuario {self.usuario_id} en partido {self.partido_id} - {self.resultado_apostado}"
