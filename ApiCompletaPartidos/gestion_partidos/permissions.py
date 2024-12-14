import requests
from rest_framework.permissions import BasePermission

class IsAdminPartidos(BasePermission):
    """
    Permiso personalizado para validar que el usuario tiene el rol 'admin_partidos'.
    """

    def has_permission(self, request, view):
        # Verifica que el token JWT esté presente
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return False

        token = auth_header.split(" ")[1]


        auth_validation_url = "http://localhost:8000/api/validate-token/"

        try:
            # Valida el token en el sistema de autenticación
            response = requests.post(auth_validation_url, json={"token": token})
            if response.status_code != 200:
                return False

            user_data = response.json()
            # Verifica si el usuario tiene el rol 'admin_partidos'
            return "admin_partidos" in user_data.get("roles", [])

        except requests.RequestException:
            return False
