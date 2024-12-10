from django.contrib.auth.models import AbstractUser
from django.db import models

# Modelo de Roles
class Role(models.Model):
    ROLE_CHOICES = [
        ('cliente', 'Cliente'),
        ('recarga', 'Recarga'),
        ('admin_partidos', 'Administrador de Partidos'),
        ('admin_usuarios', 'Administrador de Usuarios'),
    ]
    name = models.CharField(max_length=20, choices=ROLE_CHOICES, unique=True)

    def __str__(self):
        return self.get_name_display()


# Modelo de Usuario
class User(AbstractUser):
    roles = models.ManyToManyField(Role, related_name='users', blank=True)

    def __str__(self):
        return self.username

    # Verifica si un usuario tiene un rol específico
    def has_role(self, role_name):
        return self.roles.filter(name=role_name).exists()

    # Método para asignar un rol al usuario
    def assign_role(self, role_name):
        role, created = Role.objects.get_or_create(name=role_name)
        self.roles.add(role)

    # Método para quitar un rol del usuario
    def remove_role(self, role_name):
        role = Role.objects.filter(name=role_name).first()
        if role:
            self.roles.remove(role)
