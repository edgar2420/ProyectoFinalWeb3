import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../service/api";
import "bootstrap/dist/css/bootstrap.min.css";

// Definir interfaces para los datos
interface User {
  id?: number;
  username: string;
  email: string;
  role: string;
  password?: string;
}

interface AxiosError {
  response?: {
    data: unknown;
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
  const [isPasswordChange, setIsPasswordChange] = useState<boolean>(false); // Estado para cambiar la contraseña
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
          console.error("Error al cargar usuario:", error.response?.data);
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
        ? { username, email, role }
        : { username, email, password, role };

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
        await api.post("/users/create/", payload);
        alert("Usuario creado con éxito");
      }
      navigate("/users");
    } catch (e: unknown) {
      const error = e as AxiosError;
      console.error("Error al guardar usuario:", error.response?.data);
      alert("Error al guardar el usuario.");
    }
  };

  // Función para manejar el cambio de contraseña
  const handlePasswordChange = () => {
    setIsPasswordChange(true);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">{id ? "Editar Usuario" : "Crear Usuario"}</h1>
      <form className="card p-4 shadow" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nombre de Usuario:</label>
          <input
            type="text"
            className="form-control"
            placeholder="Nombre de Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Correo Electrónico:</label>
          <input
            type="email"
            className="form-control"
            placeholder="Correo Electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Mostrar campo de contraseña solo si estamos creando un usuario o si se quiere cambiar la contraseña */}
        {!id && (
          <div className="mb-3">
            <label className="form-label">Contraseña:</label>
            <input
              type="password"
              className="form-control"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        )}

        {/* Si estamos editando, permitir cambio de contraseña */}
        {id && !isPasswordChange && (
          <div className="mb-3">
            <button type="button" className="btn btn-warning" onClick={handlePasswordChange}>
              Cambiar Contraseña
            </button>
          </div>
        )}

        {/* Solo mostrar los roles en creación de usuario */}
        {!id && (
          <div className="mb-3">
            <label className="form-label">Rol:</label>
            <select
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="cliente">Cliente</option>
              <option value="recarga">Recarga</option>
              <option value="admin_partidos">Administrador de Partidos</option>
              <option value="admin_usuarios">Administrador de Usuarios</option>
            </select>
          </div>
        )}

        {/* Mostrar el campo de cambio de contraseña si se seleccionó */}
        {isPasswordChange && (
          <div className="mb-3">
            <label className="form-label">Nueva Contraseña:</label>
            <input
              type="password"
              className="form-control"
              placeholder="Nueva Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        )}

        <button type="submit" className="btn btn-primary w-100">
          {id ? "Guardar Cambios" : "Crear Usuario"}
        </button>
      </form>
    </div>
  );
};

export default UserForm;
