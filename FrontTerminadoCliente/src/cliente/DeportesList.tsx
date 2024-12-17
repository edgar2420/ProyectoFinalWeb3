import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDeportes } from "../service/apuestasService";
import Navbar from "./Navbar";
import "bootstrap/dist/css/bootstrap.min.css";

interface Deporte {
  id: number;
  nombre: string;
  logo?: string; // URL opcional para el logo
}

const BASE_MEDIA_URL = "http://127.0.0.1:8001"; // URL base de los recursos

const DeportesList: React.FC = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const saldo = 1000.0; // Saldo predeterminado

  const [deportes, setDeportes] = useState<Deporte[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDeportes = async () => {
      try {
        setLoading(true);
        const data = await getDeportes(); // Llama a la función que obtiene los deportes
        setDeportes(data);
      } catch (err) {
        console.error("Error al obtener deportes:", err);
        setError("No se pudieron cargar los deportes.");
      } finally {
        setLoading(false);
      }
    };

    fetchDeportes();
  }, []);

  const handleDeporteClick = (deporteId: number) => {
    // Navega a la lista de ligas por deporte
    navigate(`/cliente-dashboard/deportes/${deporteId}/ligas`);
  };

  return (
    <div className="cliente-dashboard">
      {/* Navbar con props */}
      <Navbar username={user.username || "Invitado"} saldo={saldo} />

      <div className="main-container">
        <h1 className="text-center mt-4">🏅 Deportes Disponibles</h1>

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

        {/* Lista de Deportes */}
        {!loading && !error && deportes.length > 0 && (
          <div className="container mt-4">
            <div className="row g-4">
              {deportes.map((deporte) => (
                <div
                  key={deporte.id}
                  className="col-md-4"
                  onClick={() => handleDeporteClick(deporte.id)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="card shadow-sm border-0 rounded-3">
                    <div className="card-body text-center">
                      <img
                        src={
                          deporte.logo
                            ? `${BASE_MEDIA_URL}${deporte.logo}`
                            : "https://via.placeholder.com/100?text=Sin+Logo"
                        }
                        alt={deporte.nombre}
                        className="rounded-circle mb-3"
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                        }}
                      />
                      <h5 className="card-title">{deporte.nombre}</h5>
                      <button className="btn btn-primary btn-sm">
                        Ver Ligas
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mensaje si no hay deportes */}
        {!loading && !error && deportes.length === 0 && (
          <div className="alert alert-warning text-center mt-5">
            No hay deportes disponibles.
          </div>
        )}
      </div>
    </div>
  );
};

export default DeportesList;

