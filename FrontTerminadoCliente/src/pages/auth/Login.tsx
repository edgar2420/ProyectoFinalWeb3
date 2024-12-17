import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../service/api";
import { AxiosError } from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css"; // Importamos los estilos

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>(""); // Estado para el nombre de usuario
  const [password, setPassword] = useState<string>(""); // Estado para la contraseña
  const [error, setError] = useState<string | null>(null); // Estado para manejar errores
  const navigate = useNavigate(); // Hook para redirección

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Realiza la solicitud de login
      const response = await api.post("login/", { username, password });
      console.log("Respuesta del login:", response.data);

      const { access, roles, username: user, email } = response.data;

      // Guarda el token, roles y datos del usuario en localStorage
      localStorage.setItem("access_token", access);
      localStorage.setItem("user_roles", JSON.stringify(roles));
      localStorage.setItem("user", JSON.stringify({ username: user, email }));

      // Redirección según el rol del usuario
      if (roles.includes("admin_partidos")) {
        navigate("/partidos-dashboard");
      } else if (roles.includes("admin_usuarios")) {
        navigate("/dashboard");
      } else if (roles.includes("recarga")) {
        navigate("/recarga-dashboard");
      } else if (roles.includes("cliente")) {
        navigate("/cliente-dashboard");
      } else {
        setError("No tienes acceso a ningún área. Contacta con el administrador.");
      }
    } catch (err) {
      const axiosError = err as AxiosError<{ error: string }>;
      if (axiosError.response) {
        setError(axiosError.response.data.error || "Error inesperado.");
      } else {
        setError("Error al conectar con el servidor.");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="card p-4 shadow-lg border-0 rounded-4 text-center">
        {/* Título */}
        <h1 className="text-primary fw-bold mb-4">Bienvenido a Boliganga.Net</h1>
        <h2 className="text-secondary mb-4">Iniciar Sesión</h2>

        {/* Formulario de Login */}
        <form onSubmit={handleLogin}>
          <div className="mb-3 text-start">
            <label htmlFor="username" className="form-label fw-bold">
              Nombre de Usuario
            </label>
            <input
              type="text"
              id="username"
              className="form-control rounded-3"
              placeholder="Tu usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3 text-start">
            <label htmlFor="password" className="form-label fw-bold">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              className="form-control rounded-3"
              placeholder="Tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Mensaje de Error */}
          {error && (
            <div className="alert alert-danger text-center rounded-3">
              {error}
            </div>
          )}

          {/* Botón de Login */}
          <button
            type="submit"
            className="btn btn-primary w-100 py-2 rounded-3 fw-bold mb-3"
          >
            Iniciar Sesión
          </button>
        </form>

        {/* Enlace para registrarse */}
        <p className="text-secondary">
          ¿No tienes una cuenta?{" "}
          <span
            className="text-primary fw-bold"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/register")}
          >
            Regístrate aquí
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
