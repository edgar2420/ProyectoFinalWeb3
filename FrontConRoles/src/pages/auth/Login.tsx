import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importamos useNavigate
import api from "../../service/api";
import { AxiosError } from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>(""); // Estado para el usuario
  const [password, setPassword] = useState<string>(""); // Estado para la contraseña
  const [error, setError] = useState<string | null>(null); // Estado para errores
  const navigate = useNavigate(); // Hook para realizar redirecciones

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.post("/login/", { username, password });

      const { access, roles } = response.data;

      // Guardar el token en localStorage
      localStorage.setItem("access_token", access);
      localStorage.setItem("user_roles", JSON.stringify(roles)); // Guardar roles

      // Redirigir según el rol
      if (roles.includes("admin_usuarios")) {
        navigate("/dashboard");
      } else if (roles.includes("cliente")) {
        navigate("/cliente-dashboard");
      } else if (roles.includes("recarga")) {
        navigate("/recarga-dashboard");
      } else if (roles.includes("admin_partidos")) {
        navigate("/partidos-dashboard");
      } else {
        setError("No tienes acceso a ningún área.");
      }
    } catch (err) {
      const axiosError = err as AxiosError<{ error: string }>;
      if (axiosError.response) {
        setError(axiosError.response.data.error || "Error inesperado");
      } else {
        setError("Error al conectar con el servidor");
      }
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <div className="card p-4 shadow" style={{ width: "100%", maxWidth: "400px" }}>
        <h2 className="text-center mb-4">Iniciar Sesión</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Nombre de Usuario
            </label>
            <input
              type="text"
              id="username"
              className="form-control"
              placeholder="Nombre de Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="alert alert-danger text-center">{error}</div>}
          <button type="submit" className="btn btn-primary w-100">
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
