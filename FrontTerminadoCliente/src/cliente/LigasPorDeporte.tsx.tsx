import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLigasPorDeporte } from "../service/apuestasService";
import Navbar from "./Navbar"; // Importa el Navbar
import "bootstrap/dist/css/bootstrap.min.css";
import "./ClienteDashboard.css";

interface Liga {
  id: number;
  nombre: string;
  logo?: string; // URL opcional del logo
}

const BASE_MEDIA_URL = "http://localhost:8001"; // URL base del backend

const LigasPorDeporte: React.FC = () => {
  const { deporte_id } = useParams<{ deporte_id: string }>(); // Obtiene el parámetro de la URL
  const [ligas, setLigas] = useState<Liga[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}"); // Obtener el usuario de localStorage
  const saldo = 1000.0; // Saldo predeterminado

  useEffect(() => {
    const fetchLigas = async () => {
      try {
        const data = await getLigasPorDeporte(Number(deporte_id)); // Llama al servicio
        setLigas(data);
      } catch (err) {
        console.error("Error al obtener ligas:", err);
        setError("No se pudo cargar la lista de ligas.");
      } finally {
        setLoading(false);
      }
    };

    fetchLigas();
  }, [deporte_id]);

  return (
    <div className="cliente-dashboard">
      {/* Navbar con props */}
      <Navbar username={user.username || "Invitado"} saldo={saldo} />

      {/* Contenido principal */}
      <div className="main-container">
        <main className="content">
          <h3 className="text-center mb-4 fw-bold">🏆 Ligas Disponibles</h3>

          {/* Loading Spinner */}
          {loading && (
            <div className="text-center my-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="alert alert-danger text-center">{error}</div>
          )}

          {/* Lista de Ligas */}
          {!loading && !error && ligas.length > 0 && (
            <div className="partidos-grid">
              {ligas.map((liga) => (
                <div
                  key={liga.id}
                  className="card shadow-sm border-0 rounded-3"
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    navigate(`/cliente-dashboard/ligas/${liga.id}/partidos`)
                  }
                >
                  <div className="card-header bg-primary text-white text-center fw-bold">
                    {liga.nombre}
                  </div>
                  <div className="card-body text-center">
                    <img
                      src={
                        liga.logo
                          ? `${BASE_MEDIA_URL}${liga.logo}`
                          : "https://via.placeholder.com/150x150?text=Sin+Logo"
                      }
                      alt={liga.nombre}
                      className="rounded-circle mb-3"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        border: "2px solid #ddd",
                      }}
                    />
                    <button className="btn btn-primary btn-sm shadow-sm">
                      Ver Partidos
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Si no hay ligas */}
          {!loading && !error && ligas.length === 0 && (
            <div className="alert alert-warning text-center mt-5">
              No hay ligas disponibles para este deporte.
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default LigasPorDeporte;
