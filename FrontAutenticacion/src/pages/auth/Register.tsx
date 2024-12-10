import React, { useState } from "react";
import api from "../../service/api";
import { AxiosError } from "axios";

const Register: React.FC = () => {
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [role, setRole] = useState<string>("cliente"); // Estado para el rol
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
  
    const handleRegister = async (e: React.FormEvent) => {
      e.preventDefault();
  
      try {
        await api.post("/register/", { username, email, password, role }); // Incluye el rol
        setSuccess("Usuario registrado con éxito");
        setError(null);
        setUsername("");
        setEmail("");
        setPassword("");
        setRole("cliente");
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
      <div>
        <h2>Registrar Usuario</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Nombre de Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Correo Electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="cliente">Cliente</option>
            <option value="recarga">Recarga</option>
            <option value="admin_partidos">Administrador de Partidos</option>
            <option value="admin_usuarios">Administrador de Usuarios</option>
          </select>
          <button type="submit">Registrar</button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
      </div>
    );
  };

export default Register;
