import React from "react";
import Navbar from "../../pages/components/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";

const Dashboard: React.FC = () => {
  return (
    <div>
      <Navbar />
      <div className="container mt-5 d-flex flex-column align-items-center">
        <h1 className="mb-4 text-center">Bienvenido al Dashboard</h1>
        <ul className="list-group w-50">
          <li className="list-group-item text-center">
            <a href="/users" className="btn btn-primary w-100">
              Gestionar Usuarios
            </a>
          </li>
          <li className="list-group-item text-center">
            <a href="/users/create" className="btn btn-success w-100">
              Crear Usuario
            </a>
          </li>
          <li className="list-group-item text-center">
            <a href="/users/:id/change-password" className="btn btn-warning w-100">
              Cambiar Contraseña
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
