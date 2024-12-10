import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../service/api";

// Definir interfaces para los datos
interface User {
  id?: number;
  username: string;
  email: string;
  role: string; // Cambiado de 'roles: string[]' a 'role: string'
  password?: string;
}

interface AxiosError {
  response?: {
    data: unknown; // Cambiado de 'any' a 'unknown'
    status: number;
    statusText: string;
  };
  message: string;
}

const UserForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [username, setUsername] = useState<string>(""); // Nombre de usuario
  const [email, setEmail] = useState<string>(""); // Correo electrónico
  const [password, setPassword] = useState<string>(""); // Contraseña (solo para creación)
  const [role, setRole] = useState<string>("cliente"); // Rol
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      // Si estamos editando, cargar los datos del usuario existente
      const fetchUser = async () => {
        try {
          const response = await api.get<User>(`/users/${id}/`);
          const user = response.data;
          setUsername(user.username);
          setEmail(user.email);
          setRole(user.role); // Ajustado para rol único
        } catch (e: unknown) {
          const error = e as AxiosError;
          const responseData = error.response?.data;
          console.error(
            "Error al cargar usuario:",
            typeof responseData === "object" ? JSON.stringify(responseData) : responseData
          );
          alert("No se pudo cargar la información del usuario.");
        }
      };
      fetchUser();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: Partial<User> = id
        ? { username, email, role } // Cambiado a 'role'
        : { username, email, password, role }; // Cambiado a 'role'

      console.log("Payload enviado:", payload);

      if (id) {
        // Edición
        await api.put(`/users/${id}/edit/`, payload);
        alert("Usuario actualizado con éxito");
      } else {
        // Creación
        if (!password) {
          alert("La contraseña es obligatoria para crear un usuario.");
          return;
        }
        await api.post("/users/create/", payload); // Ajustado el payload
        alert("Usuario creado con éxito");
      }
      navigate("/users");
    } catch (e: unknown) {
      const error = e as AxiosError;
      if (error.response) {
        const responseData = error.response.data;
        console.error(
          "Error al guardar usuario:",
          typeof responseData === "object" ? JSON.stringify(responseData) : responseData
        );
        alert(`Error: ${JSON.stringify(responseData)}`);
      } else {
        console.error("Error inesperado:", error.message);
        alert("Ocurrió un error inesperado.");
      }
    }
  };

  return (
    <div>
      <h1>{id ? "Editar Usuario" : "Crear Usuario"}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre de Usuario:</label>
          <input
            type="text"
            placeholder="Nombre de Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Correo Electrónico:</label>
          <input
            type="email"
            placeholder="Correo Electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        {!id && ( // Mostrar el campo de contraseña solo al crear usuarios
          <div>
            <label>Contraseña:</label>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        )}
        <div>
          <label>Rol:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="cliente">Cliente</option>
            <option value="recarga">Recarga</option>
            <option value="admin_partidos">Administrador de Partidos</option>
            <option value="admin_usuarios">Administrador de Usuarios</option>
          </select>
        </div>
        <button type="submit">{id ? "Guardar Cambios" : "Crear Usuario"}</button>
      </form>
    </div>
  );
};

export default UserForm;
