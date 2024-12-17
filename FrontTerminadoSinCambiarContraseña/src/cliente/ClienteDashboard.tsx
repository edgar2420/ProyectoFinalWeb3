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
  const [partidosPasados, setPartidosPasados] = useState<Partido[]>([]);
  const [partidosActuales, setPartidosActuales] = useState<Partido[]>([]);
  const [partidosFuturos, setPartidosFuturos] = useState<Partido[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const saldo = 1000.0;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const deportesData = await getDeportes();
        setDeportes(deportesData);

        const partidosData = await getPartidos();
        setPartidosPasados(partidosData.partidos_pasados || []);
        setPartidosActuales(partidosData.partidos_actuales || []);
        setPartidosFuturos(partidosData.partidos_futuros || []);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError("No se pudieron cargar los datos.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeporteClick = (deporteId: number) => {
    navigate(`/cliente-dashboard/deportes/${deporteId}/ligas`);
  };

  const getImageUrl = (logo: string | null | undefined): string => {
    if (!logo) return "https://via.placeholder.com/70?text=No+Logo";
    return logo.startsWith("http") ? logo : `${BASE_MEDIA_URL}${logo}`;
  };

  const renderPartidos = (partidos: Partido[], titulo: string) => (
    <div className="mb-5">
      <h4 className="text-primary mb-3">{titulo}</h4>
      {partidos.length === 0 ? (
        <p className="text-muted">No hay partidos disponibles.</p>
      ) : (
        <div className="row g-4">
          {partidos.map((partido) => (
            <div key={partido.id} className="col-md-6 col-lg-4">
              <div className="card shadow-sm border-0 rounded-3">
                <div className="card-header bg-primary text-white text-center fw-bold">
                  {partido.estado || "⏳ Próximo Partido"}
                </div>
                <div className="card-body text-center">
                  <div className="d-flex justify-content-around align-items-center mb-3">
                    <div>
                      <img
                        src={getImageUrl(partido.equipo_local_logo)}
                        alt={partido.equipo_local}
                        className="rounded-circle border"
                        style={{ width: "70px", height: "70px", objectFit: "cover" }}
                      />
                      <p className="fw-bold mt-2">{partido.equipo_local}</p>
                    </div>
                    <h5 className="fw-bold text-muted">VS</h5>
                    <div>
                      <img
                        src={getImageUrl(partido.equipo_visitante_logo)}
                        alt={partido.equipo_visitante}
                        className="rounded-circle border"
                        style={{ width: "70px", height: "70px", objectFit: "cover" }}
                      />
                      <p className="fw-bold mt-2">{partido.equipo_visitante}</p>
                    </div>
                  </div>
                  <p className="text-muted">{new Date(partido.fecha).toLocaleString()}</p>
                  <div className="d-flex justify-content-around">
                    <button className="btn btn-primary">Win 1</button>
                    <button className="btn btn-secondary">Empate</button>
                    <button className="btn btn-success">Win 2</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="cliente-dashboard">
      {/* Navbar */}
      <Navbar username={user.username || "Invitado"} saldo={saldo} />

      <div className="main-container d-flex">
        {/* Sidebar */}
        <aside className="sidebar p-3 bg-light border-end">
          <h5 className="text-primary text-center mb-4">🏅 Deportes</h5>

          {loading && (
            <div className="text-center my-3">
              <div className="spinner-border text-primary"></div>
            </div>
          )}

          {error && (
            <div className="alert alert-danger text-center">{error}</div>
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
                  src={getImageUrl(deporte.logo)}
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

          {loading ? (
            <div className="text-center my-5">
              <div className="spinner-border text-primary"></div>
            </div>
          ) : error ? (
            <div className="alert alert-danger text-center">{error}</div>
          ) : (
            <>
              {renderPartidos(partidosPasados, "🏁 Partidos Pasados")}
              {renderPartidos(partidosActuales, "⏳ Partidos Actuales")}
              {renderPartidos(partidosFuturos, "🚀 Partidos Futuros")}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ClienteDashboard;