from django.urls import path
from .views import (
    TestView,
    DeporteListCreateAPIView,
    DeporteDetailAPIView,
    LigaListCreateAPIView,
    LigaDetailAPIView,
    EquipoListCreateAPIView,
    EquipoDetailAPIView,
    PartidoListCreateAPIView,
    PartidoDetailAPIView,
    EventoListCreateAPIView,
    EventoDetailAPIView,
)

urlpatterns = [
    path('test/', TestView.as_view(), name='test'),
    path('deportes/', DeporteListCreateAPIView.as_view(), name='deporte-list-create'),
    path('deportes/<int:pk>/', DeporteDetailAPIView.as_view(), name='deporte-detail'),
    path('ligas/', LigaListCreateAPIView.as_view(), name='liga-list-create'),
    path('ligas/<int:pk>/', LigaDetailAPIView.as_view(), name='liga-detail'),
    path('equipos/', EquipoListCreateAPIView.as_view(), name='equipo-list-create'),
    path('equipos/<int:pk>/', EquipoDetailAPIView.as_view(), name='equipo-detail'),
    path('partidos/', PartidoListCreateAPIView.as_view(), name='partido-list-create'),
    path('partidos/<int:pk>/', PartidoDetailAPIView.as_view(), name='partido-detail'),
    path('eventos/', EventoListCreateAPIView.as_view(), name='evento-list-create'),
    path('eventos/<int:pk>/', EventoDetailAPIView.as_view(), name='evento-detail'),
]
