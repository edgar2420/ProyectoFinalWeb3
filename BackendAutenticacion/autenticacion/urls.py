from django.urls import path, include
from rest_framework.routers import DefaultRouter
from autenticacion.api.views import (
    RegisterView,
    LoginView,
    LogoutView,  # Nueva vista de logout
    UserListView,
    UserDetailView,  # Detalles de un usuario
    UserUpdateView,  # Editar usuario
    AssignRoleView,
    RemoveRoleView,
    ChangePasswordView,
    RoleListView, UserDeleteView, UserCreateView  # Listar roles
)

# Router para futuros ViewSets
router = DefaultRouter()

urlpatterns = [
    # Rutas de autenticación
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/logout/', LogoutView.as_view(), name='logout'),  # Ruta de logout

    # Rutas de usuarios
    path('api/users/', UserListView.as_view(), name='user_list'),  # Listar usuarios
    path('api/users/<int:user_id>/', UserDetailView.as_view(), name='user_detail'),  # Detalles de un usuario
    path('api/users/<int:user_id>/edit/', UserUpdateView.as_view(), name='user_update'),  # Editar usuario
    path('api/users/<int:user_id>/delete/', UserDeleteView.as_view(), name='user_delete'),

    path('api/users/create/', UserCreateView.as_view(), name='user_create'),

    path('api/users/<int:user_id>/assign-role/<str:role_name>/', AssignRoleView.as_view(), name='assign_role'),
    path('api/users/<int:user_id>/remove-role/<str:role_name>/', RemoveRoleView.as_view(), name='remove_role'),
    path('api/users/<int:user_id>/change-password/', ChangePasswordView.as_view(), name='change_password'),

    # Rutas para roles
    path('api/roles/', RoleListView.as_view(), name='role_list'),  # Listar roles

    # Rutas del router
    path('api/', include(router.urls)),
]
