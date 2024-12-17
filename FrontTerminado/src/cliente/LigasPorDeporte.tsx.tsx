import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLigasPorDeporte } from "../service/apuestasService";
import "bootstrap/dist/css/bootstrap.min.css";

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
    <div className="container mt-5">
      <h2 className="text-center mb-4">Ligas Disponibles</h2>
      {loading && (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      )}

      {error && <div className="alert alert-danger text-center">{error}</div>}

      {!loading && !error && (
        <div className="row g-4">
          {ligas.map((liga) => (
            <div
              key={liga.id}
              className="col-12 col-sm-6 col-md-4 col-lg-3"
              onClick={() =>
                navigate(`/cliente-dashboard/ligas/${liga.id}/partidos`)
              }
            >
              <div className="card h-100 shadow-sm border-0">
                <img
                  src={
                    liga.logo
                      ? `${BASE_MEDIA_URL}${liga.logo}`
                      : "https://via.placeholder.com/180x180?text=Sin+Logo"
                  }
                  alt={liga.nombre}
                  className="card-img-top"
                  style={{ height: "180px", objectFit: "cover" }}
                />
                <div className="card-body text-center">
                  <h5 className="card-title">{liga.nombre}</h5>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LigasPorDeporte;
