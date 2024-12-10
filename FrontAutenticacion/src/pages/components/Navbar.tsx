import React from "react";

const Navbar: React.FC = () => {
  const handleLogout = () => {
    document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/login"; // Redirigir al login tras el logout
  };

  return (
    <nav>
      <a href="/dashboard">Dashboard</a>
      <a href="/users">Usuarios</a>
      <button onClick={handleLogout}>Cerrar Sesión</button>
    </nav>
  );
};

export default Navbar;
