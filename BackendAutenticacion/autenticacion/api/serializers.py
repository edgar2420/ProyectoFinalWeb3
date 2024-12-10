from rest_framework import serializers
from autenticacion.models.models import User, Role

# Serializador para listar roles
class RoleListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ['name']


# Serializador para listar usuarios
class UserSerializer(serializers.ModelSerializer):
    roles = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='name'  # Devuelve solo el nombre del rol
    )

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'roles']


# Serializador para registrar usuarios
class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8, required=True)
    role = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'role']

    def validate_role(self, value):
        # Normalizar a minúsculas
        value = value.lower()
        if not Role.objects.filter(name=value).exists():
            raise serializers.ValidationError(f"El rol '{value}' no es válido.")
        return value

    def create(self, validated_data):
        role_name = validated_data.pop('role')  # Extraer el rol del payload
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        # Asignar el rol al usuario
        role = Role.objects.get(name=role_name)
        user.roles.add(role)
        return user



# Serializador para actualizar usuarios
class UpdateUserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ['username', 'email']

    def validate_email(self, value):
        user_id = self.instance.id if self.instance else None
        if User.objects.filter(email=value).exclude(id=user_id).exists():
            raise serializers.ValidationError("Este correo ya está en uso por otro usuario.")
        return value

    def update(self, instance, validated_data):
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.save()
        return instance


# Serializador para cambiar contraseña
class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True, required=True)
    new_password = serializers.CharField(write_only=True, required=True)

    def validate(self, data):
        if data['old_password'] == data['new_password']:
            raise serializers.ValidationError("La nueva contraseña no puede ser igual a la anterior.")
        return data


# Serializador para asignar roles
class AssignRoleSerializer(serializers.Serializer):
    role_name = serializers.CharField(required=True)

    def validate_role_name(self, value):
        if not Role.objects.filter(name=value).exists():
            raise serializers.ValidationError(f"El rol '{value}' no existe.")
        return value

    def update(self, instance, validated_data):
        role_name = validated_data['role_name']
        role = Role.objects.get(name=role_name)
        instance.roles.add(role)
        return instance


# Serializador para quitar roles
class RemoveRoleSerializer(serializers.Serializer):
    role_name = serializers.CharField(required=True)

    def validate_role_name(self, value):
        if not Role.objects.filter(name=value).exists():
            raise serializers.ValidationError(f"El rol '{value}' no existe.")
        return value

    def update(self, instance, validated_data):
        role_name = validated_data['role_name']
        role = Role.objects.get(name=role_name)
        instance.roles.remove(role)
        return instance
