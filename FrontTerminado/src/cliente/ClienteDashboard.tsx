import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDeportes } from "../service/apuestasService";
import "bootstrap/dist/css/bootstrap.min.css";

interface Deporte {
  id: number;
  nombre: string;
  logo?: string; // URL de la imagen opcional
}

const BASE_MEDIA_URL = "http://localhost:8001"; // URL base del backend

const ClienteDashboard: React.FC = () => {
  const [deportes, setDeportes] = useState<Deporte[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDeportes = async () => {
      try {
        const data = await getDeportes();
        setDeportes(data);
      } catch (err) {
        console.error("Error al obtener deportes:", err);
        setError("No se pudo cargar la lista de deportes.");
      } finally {
        setLoading(false);
      }
    };

    fetchDeportes();
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Bienvenido al Sistema de Apuestas</h1>
      <p className="text-center">
        Selecciona un deporte para ver las ligas y partidos disponibles.
      </p>

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
          {deportes.map((deporte) => (
            <div
              key={deporte.id}
              className="col-12 col-sm-6 col-md-4 col-lg-3"
              onClick={() =>
                navigate(`/cliente-dashboard/deportes/${deporte.id}/ligas`)
              }
            >
              <div className="card h-100 shadow-sm border-0">
                <img
                  src={
                    deporte.logo
                      ? `${BASE_MEDIA_URL}${deporte.logo}`
                      : "https://via.placeholder.com/180x180?text=Sin+Imagen"
                  }
                  alt={deporte.nombre}
                  className="card-img-top"
                  style={{ height: "180px", objectFit: "cover" }}
                />
                <div className="card-body text-center">
                  <h5 className="card-title">{deporte.nombre}</h5>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClienteDashboard;
