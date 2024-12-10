import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importamos useNavigate
import api from "../../service/api";
import { AxiosError } from "axios";

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>(""); // Estado para el usuario
  const [password, setPassword] = useState<string>(""); // Estado para la contraseña
  const [error, setError] = useState<string | null>(null); // Estado para errores
  const navigate = useNavigate(); // Hook para realizar redirecciones

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await api.post("/login/", { username, password });
  
      console.log("Respuesta del servidor:", response.data); // Debug
      const { access, roles } = response.data;
  
      // Guardar el token en localStorage para que sea accesible por ProtectedRoute
      localStorage.setItem("access_token", access);
      localStorage.setItem("user_roles", JSON.stringify(roles)); // Guardar roles en localStorage
  
      console.log("Roles del usuario:", roles);
  
      // Redirigir según el rol
      if (roles.includes("admin_usuarios")) {
        console.log("Redirigiendo al Dashboard de Admin Usuarios");
        navigate("/dashboard");
      } else if (roles.includes("cliente")) {
        console.log("Redirigiendo al Dashboard de Cliente");
        navigate("/cliente-dashboard");
      } else if (roles.includes("recarga")) {
        console.log("Redirigiendo al Dashboard de Recarga");
        navigate("/recarga-dashboard");
      } else if (roles.includes("admin_partidos")) {
        console.log("Redirigiendo al Dashboard de Admin Partidos");
        navigate("/partidos-dashboard");
      } else {
        setError("No tienes acceso a ningún área.");
      }
    } catch (err) {
      const axiosError = err as AxiosError<{ error: string }>;
      console.error("Error en el login:", axiosError); // Debug
      if (axiosError.response) {
        setError(axiosError.response.data.error || "Error inesperado");
      } else {
        setError("Error al conectar con el servidor");
      }
    }
  };
  
  return (
    <div>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Nombre de Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Iniciar Sesión</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Login;
