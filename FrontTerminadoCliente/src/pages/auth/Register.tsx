import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Para redirigir a login
import api from "../../service/api";
import { AxiosError } from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Register.css"; // Importamos los estilos para el register

const Register: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post("/register/", { username, email, password, role: "cliente" }); // Rol fijo "cliente"
      setSuccess("Usuario registrado con éxito. Redirigiendo al inicio de sesión...");
      setError(null);
      setUsername("");
      setEmail("");
      setPassword("");

      // Redirige al login después de 2 segundos
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      const axiosError = err as AxiosError<{ [key: string]: string[] }>;
      if (axiosError.response) {
        const errors = axiosError.response.data;
        const errorMessage = Object.values(errors)
          .flat()
          .join(", ");
        setError(errorMessage || "Error inesperado");
      } else {
        setError("Error al conectar con el servidor");
      }
    }
  };

  return (
    <div className="register-container">
      <div className="card p-4 shadow-lg border-0 rounded-4 text-center">
        {/* Título de Bienvenida */}
        <h1 className="text-primary fw-bold mb-4">Bienvenido a Boliganga.Net</h1>

        {/* Subtítulo */}
        <h2 className="text-secondary mb-4">Registrar Usuario</h2>

        {/* Formulario */}
        <form onSubmit={handleRegister}>
          {/* Nombre de Usuario */}
          <div className="mb-3 text-start">
            <label htmlFor="username" className="form-label fw-bold">
              Nombre de Usuario
            </label>
            <input
              type="text"
              id="username"
              className="form-control rounded-3"
              placeholder="Nombre de Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Correo Electrónico */}
          <div className="mb-3 text-start">
            <label htmlFor="email" className="form-label fw-bold">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              className="form-control rounded-3"
              placeholder="Correo Electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Contraseña */}
          <div className="mb-3 text-start">
            <label htmlFor="password" className="form-label fw-bold">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              className="form-control rounded-3"
              placeholder="Contraseña"
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

          {/* Mensaje de Éxito */}
          {success && (
            <div className="alert alert-success text-center rounded-3">
              {success}
            </div>
          )}

          {/* Botón de Registro */}
          <button
            type="submit"
            className="btn btn-primary w-100 py-2 rounded-3 fw-bold mb-3"
          >
            Registrar
          </button>
        </form>

        {/* Enlace para Iniciar Sesión */}
        <p className="text-secondary">
          ¿Ya tienes una cuenta?{" "}
          <span
            className="text-primary fw-bold"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/login")}
          >
            Inicia Sesión aquí
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
