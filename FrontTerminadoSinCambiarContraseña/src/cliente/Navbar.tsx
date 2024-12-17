import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

interface NavbarProps {
  username: string;
  saldo: number;
}

const Navbar: React.FC<NavbarProps> = ({ username, saldo }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/cliente-dashboard">
          ⚽ BoligangaNet
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/cliente-dashboard">
                🏠 Inicio
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/cliente-dashboard/Equipos">
                🏆 Equipos
              </Link>
            </li>
          </ul>
          <div className="navbar-text text-white ms-3">
            <span className="fw-bold">Bienvenido, {username} 👋</span>
            <span className="badge bg-warning ms-2">
              Saldo: {saldo.toFixed(2)} BOB
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
