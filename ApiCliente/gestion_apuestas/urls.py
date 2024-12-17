from django.urls import path
from .views import (
    ListaDeportesAPIView,
    ListaLigasPorDeporteAPIView,
    ListaPartidosPorLigaAPIView,
    ListaEventosPorPartidoAPIView,
    ApuestaCreateAPIView,
    ApuestaHistorialAPIView,
)

urlpatterns = [
    path('deportes/', ListaDeportesAPIView.as_view(), name='lista-deportes'),
    path('deportes/<int:deporte_id>/ligas/', ListaLigasPorDeporteAPIView.as_view(), name='lista-ligas-por-deporte'),
    path('ligas/<int:liga_id>/partidos/', ListaPartidosPorLigaAPIView.as_view(), name='lista-partidos-por-liga'),
    path('partidos/<int:partido_id>/eventos/', ListaEventosPorPartidoAPIView.as_view(), name='lista-eventos-por-partido'),
    path('apuestas/partido/<int:partido_id>/', ApuestaCreateAPIView.as_view(), name='crear-apuesta'),
    path('apuestas/historial/', ApuestaHistorialAPIView.as_view(), name='historial-apuestas'),

]
