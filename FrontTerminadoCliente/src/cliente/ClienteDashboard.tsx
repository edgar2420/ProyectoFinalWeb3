import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDeportes, getPartidos } from "../service/apuestasService";
import Navbar from "./Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ClienteDashboard.css";

interface Deporte {
  id: number;
  nombre: string;
  logo?: string;
}

interface Partido {
  id: number;
  equipo_local: string;
  equipo_local_logo?: string | null;
  equipo_visitante: string;
  equipo_visitante_logo?: string | null;
  fecha: string;
  estado?: string;
}

const BASE_MEDIA_URL = "http://127.0.0.1:8001";

const ClienteDashboard: React.FC = () => {
  const [deportes, setDeportes] = useState<Deporte[]>([]);
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [loadingDeportes, setLoadingDeportes] = useState<boolean>(true);
  const [loadingPartidos, setLoadingPartidos] = useState<boolean>(true);
  const [errorDeportes, setErrorDeportes] = useState<string | null>(null);
  const [errorPartidos, setErrorPartidos] = useState<string | null>(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const saldo = 1000.0;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDeportes = async () => {
      try {
        const deportesData = await getDeportes();
        setDeportes(deportesData);
      } catch (err) {
        console.error("Error al cargar deportes:", err);
        setErrorDeportes("No se pudieron cargar los deportes.");
      } finally {
        setLoadingDeportes(false);
      }
    };
    fetchDeportes();
  }, []);

  useEffect(() => {
    const fetchPartidos = async () => {
      try {
        const partidosData = await getPartidos();
        setPartidos(partidosData);
      } catch (err) {
        console.error("Error al cargar partidos:", err);
        setErrorPartidos("No se pudieron cargar los partidos.");
      } finally {
        setLoadingPartidos(false);
      }
    };
    fetchPartidos();
  }, []);

  const handleDeporteClick = (deporteId: number) => {
    navigate(`/cliente-dashboard/deportes/${deporteId}/ligas`);
  };

  // Manejador de apuestas
  const handleApuestaClick = (partidoId: number, apuesta: string) => {
    console.log(`Apuesta realizada: Partido ID ${partidoId}, Opción: ${apuesta}`);
    alert(`Apuesta realizada: ${apuesta} para el partido ID ${partidoId}`);
  };

  return (
    <div className="cliente-dashboard">
      {/* Navbar */}
      <Navbar username={user.username || "Invitado"} saldo={saldo} />

      <div className="main-container d-flex">
        {/* Sidebar */}
        <aside className="sidebar p-3 bg-light border-end">
          <h5 className="text-primary text-center mb-4">🏅 Deportes</h5>

          {loadingDeportes && (
            <div className="text-center my-3">
              <div className="spinner-border text-primary"></div>
            </div>
          )}

          {errorDeportes && (
            <div className="alert alert-danger text-center">{errorDeportes}</div>
          )}

          <ul className="list-unstyled">
            {deportes.map((deporte) => (
              <li
                key={deporte.id}
                className="d-flex align-items-center mb-3"
                onClick={() => handleDeporteClick(deporte.id)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={
                    deporte.logo?.startsWith("http")
                      ? deporte.logo
                      : deporte.logo
                      ? `${BASE_MEDIA_URL}${deporte.logo}`
                      : "https://via.placeholder.com/40?text=Deporte"
                  }
                  alt={deporte.nombre}
                  className="rounded-circle me-2 border"
                  style={{ width: "40px", height: "40px", objectFit: "cover" }}
                />
                <span className="fw-bold">{deporte.nombre}</span>
              </li>
            ))}
          </ul>
        </aside>

        {/* Contenido Principal */}
        <main className="content p-4 w-100">
          <h3 className="text-center mb-4">⚽ Partidos Disponibles</h3>

          {loadingPartidos && (
            <div className="text-center my-5">
              <div className="spinner-border text-primary"></div>
            </div>
          )}

          {errorPartidos && (
            <div className="alert alert-danger text-center">{errorPartidos}</div>
          )}

          <div className="row g-4">
            {partidos.map((partido) => (
              <div key={partido.id} className="col-md-6 col-lg-4">
                <div className="card shadow-sm border-0 rounded-3">
                  {/* Header */}
                  <div className="card-header bg-primary text-white text-center fw-bold">
                    {partido.estado || "⏳ Próximo Partido"}
                  </div>

                  {/* Body */}
                  <div className="card-body text-center">
                    <div className="d-flex justify-content-around align-items-center mb-3">
                      {/* Equipo Local */}
                      <div>
                        <img
                          src={
                            partido.equipo_local_logo?.startsWith("http")
                              ? partido.equipo_local_logo
                              : partido.equipo_local_logo
                              ? `${BASE_MEDIA_URL}${partido.equipo_local_logo}`
                              : "https://via.placeholder.com/70?text=Local"
                          }
                          alt={partido.equipo_local}
                          className="rounded-circle border"
                          style={{ width: "70px", height: "70px", objectFit: "cover" }}
                        />
                        <p className="fw-bold mt-2">{partido.equipo_local}</p>
                      </div>

                      <h5 className="fw-bold text-muted">VS</h5>

                      {/* Equipo Visitante */}
                      <div>
                        <img
                          src={
                            partido.equipo_visitante_logo?.startsWith("http")
                              ? partido.equipo_visitante_logo
                              : partido.equipo_visitante_logo
                              ? `${BASE_MEDIA_URL}${partido.equipo_visitante_logo}`
                              : "https://via.placeholder.com/70?text=Visitante"
                          }
                          alt={partido.equipo_visitante}
                          className="rounded-circle border"
                          style={{ width: "70px", height: "70px", objectFit: "cover" }}
                        />
                        <p className="fw-bold mt-2">{partido.equipo_visitante}</p>
                      </div>
                    </div>

                    <p className="text-muted">
                      {new Date(partido.fecha).toLocaleString()}
                    </p>

                    {/* Botones de apuesta */}
                    <div className="d-flex justify-content-around mt-3">
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleApuestaClick(partido.id, "Win 1")}
                      >
                        Win 1
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleApuestaClick(partido.id, "Empate")}
                      >
                        Empate
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleApuestaClick(partido.id, "Win 2")}
                      >
                        Win 2
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClienteDashboard;
