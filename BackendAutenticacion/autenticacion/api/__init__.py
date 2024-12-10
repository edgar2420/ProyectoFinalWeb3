from .views import (
    RegisterView,
    LoginView,
    UserListView,
    AssignRoleView,
    RemoveRoleView,
    ChangePasswordView,  # Asegúrate de incluir esta vista nueva
)
from .serializers import (
    UserRegistrationSerializer,
    UserSerializer,
    AssignRoleSerializer,  # También puedes incluir serializadores adicionales si los usas
    ChangePasswordSerializer,  # Incluye el nuevo serializador para cambio de contraseña
)

__all__ = [
    "RegisterView",
    "LoginView",
    "UserListView",
    "AssignRoleView",
    "RemoveRoleView",
    "ChangePasswordView",
    "UserRegistrationSerializer",
    "UserSerializer",
    "AssignRoleSerializer",
    "ChangePasswordSerializer",
]
