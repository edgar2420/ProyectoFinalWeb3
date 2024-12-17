import requests
from rest_framework.permissions import BasePermission
from rest_framework.exceptions import PermissionDenied

class IsCliente(BasePermission):
    """
    Permiso personalizado para validar que el usuario tiene el rol 'cliente'.
    """

    def has_permission(self, request, view):
        # Verifica que el token JWT esté presente
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return False

        token = auth_header.split(" ")[1]

        auth_validation_url = "http://localhost:8000/api/validate-token/"  # URL para validar el token

        try:
            # Valida el token en el sistema de autenticación
            response = requests.post(auth_validation_url, json={"token": token})
            if response.status_code != 200:
                return False  # Token inválido o no autorizado

            user_data = response.json()
            # Verifica si el usuario tiene el rol 'cliente'
            return "cliente" in user_data.get("roles", [])

        except requests.RequestException as e:
            # Maneja errores de conexión o solicitud
            print(f"Error al conectar con el sistema de autenticación: {e}")
            return False
