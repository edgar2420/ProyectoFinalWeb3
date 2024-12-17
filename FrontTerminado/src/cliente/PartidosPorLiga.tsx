import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPartidosPorLiga } from "../service/apuestasService";
import "bootstrap/dist/css/bootstrap.min.css";

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

const BASE_MEDIA_URL = "http://localhost:8001"; // URL base del backend

const PartidosPorLiga: React.FC = () => {
  const { liga_id } = useParams<{ liga_id: string }>(); // Obtiene el parámetro liga_id de la URL
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

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Partidos Disponibles</h2>

      {loading && (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      )}

      {error && <div className="alert alert-danger text-center">{error}</div>}

      {!loading && !error && partidos.length > 0 && (
        <div className="row g-4">
          {partidos.map((partido) => (
            <div
              key={partido.id}
              className="col-12 col-md-6"
              onClick={() =>
                navigate(`/cliente-dashboard/partidos/${partido.id}/detalle`)
              }
            >
              <div className="card shadow-sm border-0">
                <div className="card-body text-center">
                  <div className="d-flex justify-content-around align-items-center">
                    <div>
                      <img
                        src={
                          partido.equipo_local_logo
                            ? `${BASE_MEDIA_URL}${partido.equipo_local_logo}`
                            : "https://via.placeholder.com/80?text=Equipo"
                        }
                        alt={partido.equipo_local}
                        className="img-fluid rounded-circle"
                        style={{ width: "80px", height: "80px" }}
                      />
                      <p>{partido.equipo_local}</p>
                    </div>
                    <div>
                      <p className="fw-bold mb-1">VS</p>
                      <p className="text-muted">
                        {new Date(partido.fecha).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <img
                        src={
                          partido.equipo_visitante_logo
                            ? `${BASE_MEDIA_URL}${partido.equipo_visitante_logo}`
                            : "https://via.placeholder.com/80?text=Equipo"
                        }
                        alt={partido.equipo_visitante}
                        className="img-fluid rounded-circle"
                        style={{ width: "80px", height: "80px" }}
                      />
                      <p>{partido.equipo_visitante}</p>
                    </div>
                  </div>
                </div>
                <div className="card-footer text-center">
                  <button className="btn btn-primary btn-sm">
                    Ver Detalle del Partido
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && partidos.length === 0 && (
        <div className="alert alert-warning text-center">
          No hay partidos disponibles en esta liga.
        </div>
      )}
    </div>
  );
};

export default PartidosPorLiga;
