import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLigasPorDeporte } from "../service/apuestasService";
import Navbar from "./Navbar";

interface Liga {
  id: number;
  nombre: string;
  logo?: string; // Logo opcional
}

const BASE_MEDIA_URL = "http://localhost:8001";

const LigasList: React.FC = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const saldo = 1000.0;

  const [ligas, setLigas] = useState<Liga[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const deporteId = 1; // Ejemplo: ID de deporte fijo (ajusta dinámicamente si lo necesitas)

  useEffect(() => {
    const fetchLigas = async () => {
      try {
        setLoading(true);
        const data = await getLigasPorDeporte(deporteId);
        setLigas(data);
      } catch (err) {
        console.error("Error al obtener las ligas:", err);
        setError("No se pudieron cargar las ligas.");
      } finally {
        setLoading(false);
      }
    };

    fetchLigas();
  }, []);

  return (
    <div className="cliente-dashboard">
      {/* Navbar */}
      <Navbar username={user.username || "Invitado"} saldo={saldo} />

      <div className="main-container">
        <h1 className="text-center mt-4">🏆 Ligas Disponibles</h1>

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
          <div className="container mt-4">
            <div className="row g-4">
              {ligas.map((liga) => (
                <div
                  key={liga.id}
                  className="col-md-4"
                  onClick={() =>
                    navigate(`/cliente-dashboard/ligas/${liga.id}/partidos`)
                  }
                  style={{ cursor: "pointer" }}
                >
                  <div className="card shadow-sm border-0 rounded-3">
                    <div className="card-body text-center">
                      <img
                        src={
                          liga.logo
                            ? `${BASE_MEDIA_URL}${liga.logo}`
                            : "https://via.placeholder.com/100?text=Sin+Logo"
                        }
                        alt={liga.nombre}
                        className="rounded-circle mb-3"
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                        }}
                      />
                      <h5 className="card-title">{liga.nombre}</h5>
                      <button className="btn btn-primary btn-sm">
                        Ver Partidos
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mensaje si no hay ligas */}
        {!loading && !error && ligas.length === 0 && (
          <div className="alert alert-warning text-center mt-5">
            No hay ligas disponibles para este deporte.
          </div>
        )}
      </div>
    </div>
  );
};

export default LigasList;
