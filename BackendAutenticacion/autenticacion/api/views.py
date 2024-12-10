from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated, BasePermission
from autenticacion.models.models import User, Role
from .serializers import (
    UserRegistrationSerializer,
    UserSerializer,
    ChangePasswordSerializer
)

# Permiso para administradores
class IsAdminUserManager(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.roles.filter(name="admin_usuarios").exists()
        )

class LogoutView(APIView):
    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            token = RefreshToken(refresh_token)
            token.blacklist()  # Añade el token a la lista negra
            return Response({"message": "Sesión cerrada correctamente."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# Registro de usuarios
class RegisterView(APIView):
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            # Asignar el rol especificado, o "cliente" por defecto
            role_name = request.data.get("role", "cliente")
            role = Role.objects.filter(name=role_name).first()
            if not role:
                return Response({"error": f"Rol '{role_name}' no es válido."}, status=status.HTTP_400_BAD_REQUEST)

            user.roles.add(role)
            return Response({"message": "Usuario registrado con éxito"}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Login de usuarios
class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        # Verificar si el usuario existe y las credenciales son válidas
        user = User.objects.filter(username=username).first()
        if not user or not user.check_password(password):
            return Response({"error": "Credenciales inválidas"}, status=status.HTTP_401_UNAUTHORIZED)

        # Generar tokens JWT
        refresh = RefreshToken.for_user(user)
        roles = user.roles.values_list('name', flat=True)  # Obtener los roles del usuario

        # Validar que el usuario tenga al menos un rol asignado
        if not roles:
            return Response({"error": "El usuario no tiene roles asignados."}, status=status.HTTP_403_FORBIDDEN)

        # Crear respuesta con tokens y datos del usuario
        response = Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'roles': list(roles),
            'username': user.username,
            'email': user.email
        }, status=status.HTTP_200_OK)

        # Configurar la cookie para almacenar el token de acceso
        response.set_cookie(
            key='access_token',
            value=str(refresh.access_token),
            httponly=True,  # Protege la cookie de accesos por JavaScript
            samesite='Lax',  # Protege contra ataques CSRF
            secure=True,  # Requiere HTTPS en producción
        )

        return response


# Listado de usuarios
class UserListView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserManager]

    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# Crear usuario (para administradores)
class UserCreateView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserManager]

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            # Asignar rol si se especifica
            role_name = request.data.get("role", "cliente")
            role = Role.objects.filter(name=role_name).first()
            if not role:
                return Response({"error": f"Rol '{role_name}' no es válido."}, status=status.HTTP_400_BAD_REQUEST)

            user.roles.add(role)
            return Response({"message": "Usuario creado con éxito"}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserCreateView(APIView):
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Usuario creado con éxito"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Editar usuario
class UserUpdateView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserManager]

    def put(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            user.username = request.data.get("username", user.username)
            user.email = request.data.get("email", user.email)
            user.save()
            return Response({"message": "Usuario actualizado con éxito"}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)


# Eliminar usuario
class UserDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            user.delete()
            return Response({"message": "Usuario eliminado con éxito"}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)



# Asignar un rol a un usuario
class AssignRoleView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserManager]

    def post(self, request, user_id, role_name):
        try:
            user = User.objects.get(id=user_id)
            role = Role.objects.filter(name=role_name).first()
            if not role:
                return Response({"error": f"Rol '{role_name}' no encontrado."}, status=status.HTTP_400_BAD_REQUEST)

            user.roles.add(role)
            return Response({"message": f"Rol '{role_name}' asignado al usuario '{user.username}'"}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)


# Quitar un rol a un usuario
class RemoveRoleView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserManager]

    def post(self, request, user_id, role_name):
        try:
            user = User.objects.get(id=user_id)
            role = Role.objects.filter(name=role_name).first()
            if not role:
                return Response({"error": f"Rol '{role_name}' no encontrado."}, status=status.HTTP_400_BAD_REQUEST)

            user.roles.remove(role)
            return Response({"message": f"Rol '{role_name}' eliminado del usuario '{user.username}'"}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)


# Cambiar contraseña de un usuario
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, user_id=None):
        user = User.objects.get(id=user_id) if user_id else request.user

        if request.user != user and not request.user.roles.filter(name="admin_usuarios").exists():
            return Response({"error": "No tienes permiso para cambiar esta contraseña."}, status=status.HTTP_403_FORBIDDEN)

        new_password = request.data.get("new_password")
        if not new_password:
            return Response({"error": "La nueva contraseña es requerida."}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        return Response({"message": "Contraseña actualizada con éxito"}, status=status.HTTP_200_OK)


# Listar roles disponibles
class RoleListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        roles = Role.objects.all().values_list("name", flat=True)
        return Response(list(roles), status=status.HTTP_200_OK)


# Detalles de usuario
class UserDetailView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserManager]

    def get(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)
