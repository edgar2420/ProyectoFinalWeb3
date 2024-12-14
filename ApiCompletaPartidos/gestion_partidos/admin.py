from django.contrib import admin
from .models import Deporte, Liga, Equipo, Partido, Evento

# Registro de modelos en el admin de Django
admin.site.register(Deporte)
admin.site.register(Liga)
admin.site.register(Equipo)
admin.site.register(Partido)
admin.site.register(Evento)
