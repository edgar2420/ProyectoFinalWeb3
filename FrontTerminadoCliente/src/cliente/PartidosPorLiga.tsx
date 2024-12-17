import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPartidosPorLiga } from "../service/apuestasService";
import Navbar from "./Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ClienteDashboard.css";

interface Partido {
  id: number;
  equipo_local: string;
  equipo_local_logo?: string | null;
  equipo_visitante: string;
  equipo_visitante_logo?: string | null;
  fecha: string; // Fecha del partido
  marcador_local: number;
  marcador_visitante: number;
}

const BASE_MEDIA_URL = "http://localhost:8001";

const PartidosPorLiga: React.FC = () => {
  const { liga_id } = useParams<{ liga_id: string }>();
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPartidos = async () => {
      try {
        const data = await getPartidosPorLiga(Number(liga_id));
        setPartidos(data);
      } catch (err) {
        console.error("Error al obtener partidos:", err);
        setError("No se pudo cargar la lista de partidos.");
      } finally {
        setLoading(false);
      }
    };

    fetchPartidos();
  }, [liga_id]);

  const user = JSON.parse(localStorage.getItem("user") || "{}"); // Obtener usuario de localStorage
  const saldo = 1000.0; // Saldo predeterminado

  return (
    <div className="cliente-dashboard">
      {/* Navbar */}
      <Navbar username={user.username || "Invitado"} saldo={saldo} />

      {/* Contenedor principal */}
      <div className="main-container">
        <main className="content">
          <h3 className="text-center mb-4">📅 Partidos de la Liga</h3>

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

          {/* Lista de Partidos */}
          {!loading && !error && partidos.length > 0 && (
            <div className="partidos-grid">
              {partidos.map((partido) => (
                <div
                  key={partido.id}
                  className="card shadow border-0 rounded-3"
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    navigate(`/cliente-dashboard/partidos/${partido.id}/detalle`)
                  }
                >
                  <div className="card-header bg-primary text-white text-center fw-bold">
                    {new Date(partido.fecha).toLocaleDateString()}
                  </div>
                  <div className="card-body">
                    <div className="d-flex justify-content-around align-items-center mb-3">
                      {/* Equipo Local */}
                      <div className="text-center">
                        <img
                          src={
                            partido.equipo_local_logo
                              ? `${BASE_MEDIA_URL}${partido.equipo_local_logo}`
                              : "https://via.placeholder.com/80?text=Equipo"
                          }
                          alt={partido.equipo_local}
                          className="rounded-circle border"
                          style={{ width: "80px", height: "80px" }}
                        />
                        <p className="fw-bold mt-2">{partido.equipo_local}</p>
                      </div>

                      <h5 className="fw-bold text-muted">VS</h5>

                      {/* Equipo Visitante */}
                      <div className="text-center">
                        <img
                          src={
                            partido.equipo_visitante_logo
                              ? `${BASE_MEDIA_URL}${partido.equipo_visitante_logo}`
                              : "https://via.placeholder.com/80?text=Equipo"
                          }
                          alt={partido.equipo_visitante}
                          className="rounded-circle border"
                          style={{ width: "80px", height: "80px" }}
                        />
                        <p className="fw-bold mt-2">{partido.equipo_visitante}</p>
                      </div>
                    </div>

                    {/* Fecha del Partido */}
                    <p className="text-center text-muted">
                      {new Date(partido.fecha).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Sin Partidos */}
          {!loading && !error && partidos.length === 0 && (
            <div className="alert alert-warning text-center">
              No hay partidos disponibles en esta liga.
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default PartidosPorLiga;
