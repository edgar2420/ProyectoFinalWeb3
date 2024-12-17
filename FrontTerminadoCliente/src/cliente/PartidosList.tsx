import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPartidos } from "../service/apuestasService";
import Navbar from "./Navbar";
import "bootstrap/dist/css/bootstrap.min.css";

interface Partido {
  id: number;
  equipo_local: string;
  equipo_local_logo?: string | null;
  equipo_visitante: string;
  equipo_visitante_logo?: string | null;
  fecha: string;
  estado?: string;
}

const PartidosList: React.FC = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const saldo = 1000.0;

  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPartidos = async () => {
      try {
        setLoading(true);
        const data = await getPartidos();
        console.log("Datos obtenidos:", data); // Depuración
        setPartidos(data);
      } catch (err) {
        console.error("Error al obtener partidos:", err);
        setError("No se pudieron cargar los partidos.");
      } finally {
        setLoading(false);
      }
    };

    fetchPartidos();
  }, []);

  return (
    <div className="cliente-dashboard">
      <Navbar username={user.username || "Invitado"} saldo={saldo} />

      <div className="main-container">
        <h1 className="text-center mt-4">📅 Partidos Disponibles</h1>

        {/* Spinner de carga */}
        {loading && (
          <div className="text-center my-5">
            <div className="spinner-border text-primary"></div>
          </div>
        )}

        {/* Mensaje de error */}
        {error && (
          <div className="alert alert-danger text-center">{error}</div>
        )}

        {/* Lista de partidos */}
        {!loading && !error && partidos.length > 0 && (
          <div className="container mt-4">
            <div className="row g-4">
              {partidos.map((partido) => (
                <div
                  key={partido.id}
                  className="col-md-6 col-lg-4"
                  onClick={() =>
                    navigate(`/cliente-dashboard/partidos/${partido.id}/detalle`)
                  }
                  style={{ cursor: "pointer" }}
                >
                  <div className="card shadow-sm border-0 rounded-3">
                    {/* Encabezado */}
                    <div className="card-header bg-primary text-white text-center fw-bold">
                      {partido.estado || "⏳ Próximo Partido"}
                    </div>

                    {/* Cuerpo de la tarjeta */}
                    <div className="card-body text-center">
                      <div className="d-flex justify-content-around align-items-center mb-3">
                        {/* Equipo Local */}
                        <div className="text-center">
                          <img
                            src={
                              partido.equipo_local_logo
                                ? partido.equipo_local_logo
                                : "https://via.placeholder.com/80?text=Equipo"
                            }
                            alt={partido.equipo_local}
                            className="rounded-circle border"
                            style={{
                              width: "80px",
                              height: "80px",
                              objectFit: "cover",
                            }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://via.placeholder.com/80?text=Error";
                            }}
                          />
                          <p className="fw-bold mt-2">
                            {partido.equipo_local}
                          </p>
                        </div>

                        {/* VS */}
                        <h5 className="fw-bold text-muted">VS</h5>

                        {/* Equipo Visitante */}
                        <div className="text-center">
                          <img
                            src={
                              partido.equipo_visitante_logo
                                ? partido.equipo_visitante_logo
                                : "https://via.placeholder.com/80?text=Equipo"
                            }
                            alt={partido.equipo_visitante}
                            className="rounded-circle border"
                            style={{
                              width: "80px",
                              height: "80px",
                              objectFit: "cover",
                            }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://via.placeholder.com/80?text=Error";
                            }}
                          />
                          <p className="fw-bold mt-2">
                            {partido.equipo_visitante}
                          </p>
                        </div>
                      </div>

                      {/* Fecha */}
                      <p className="text-center text-muted">
                        {new Date(partido.fecha).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sin partidos */}
        {!loading && !error && partidos.length === 0 && (
          <div className="alert alert-warning text-center mt-5">
            No hay partidos disponibles.
          </div>
        )}
      </div>
    </div>
  );
};

export default PartidosList;
