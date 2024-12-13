from django.db import models

# Modelo para representar un deporte
class Deporte(models.Model):
    nombre = models.CharField(max_length=100, unique=True)  # Nombre del deporte
    logo = models.ImageField(upload_to='logos_deportes/', blank=True, null=True)  # Logo opcional del deporte

    def __str__(self):
        return self.nombre


# Modelo para representar una liga o torneo
class Liga(models.Model):
    nombre = models.CharField(max_length=100, unique=True)  # Nombre de la liga o torneo
    deporte = models.ForeignKey(Deporte, on_delete=models.CASCADE, related_name='ligas')  # Relación con Deporte
    logo = models.ImageField(upload_to='logos_ligas/', blank=True, null=True)  # Logo opcional de la liga

    def __str__(self):
        return f"{self.nombre} ({self.deporte.nombre})"


# Modelo para representar un equipo
class Equipo(models.Model):
    nombre = models.CharField(max_length=100, unique=True)  # Nombre del equipo
    logo = models.ImageField(upload_to='logos_equipos/', blank=True, null=True)  # Logo opcional del equipo

    def __str__(self):
        return self.nombre


# Modelo para representar un partido
class Partido(models.Model):
    liga = models.ForeignKey(Liga, on_delete=models.CASCADE, related_name='partidos')  # Relación con Liga
    equipo_local = models.ForeignKey(Equipo, on_delete=models.CASCADE, related_name='partidos_local')  # Equipo local
    equipo_visitante = models.ForeignKey(Equipo, on_delete=models.CASCADE, related_name='partidos_visitante')  # Equipo visitante
    fecha = models.DateTimeField()  # Fecha y hora del partido
    marcador_local = models.IntegerField(default=0)  # Marcador del equipo local
    marcador_visitante = models.IntegerField(default=0)  # Marcador del equipo visitante

    def __str__(self):
        return f"{self.equipo_local.nombre} vs {self.equipo_visitante.nombre} ({self.fecha})"


# Modelo para representar eventos ocurridos en un partido
class Evento(models.Model):
    partido = models.ForeignKey(Partido, on_delete=models.CASCADE, related_name='eventos')  # Relación con Partido
    descripcion = models.TextField()  # Descripción del evento (Ej.: "Gol de Messi")
    minuto = models.IntegerField()  # Minuto en que ocurrió el evento
    equipo = models.ForeignKey(Equipo, on_delete=models.CASCADE)  # Equipo relacionado al evento

    def __str__(self):
        return f"Evento en {self.partido}: {self.descripcion} (Minuto {self.minuto})"
