import React from "react";
import Navbar from "../../pages/components/Navbar";

const Dashboard: React.FC = () => {
  return (
    <div>
      <Navbar />
      <h1>Bienvenido al Dashboard</h1>
      <ul>
        <li>
          <a href="/users">Gestionar Usuarios</a>
        </li>
        <li>
          <a href="/users/create">Crear Usuario</a>
        </li>
        <li>
          <a href="/users/:id/roles">Gestionar Roles</a>
        </li>
        <li>
          <a href="/users/:id/change-password">Cambiar Contraseña</a>
        </li>
      </ul>
    </div>
  );
};

export default Dashboard;
