import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  // Obtén el token desde localStorage
  const token = localStorage.getItem("access_token");
  const roles = JSON.parse(localStorage.getItem("user_roles") || "[]");

  if (!token) {
    console.log("No se encontró un token. Redirigiendo al login...");
    return <Navigate to="/login" />;
  }

  if (requiredRole && !roles.includes(requiredRole)) {
    console.log(`Acceso denegado para el rol requerido: ${requiredRole}`);
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
