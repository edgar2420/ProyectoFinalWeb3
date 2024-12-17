import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDetallePartido } from "../service/apuestasService";
import "bootstrap/dist/css/bootstrap.min.css";

interface Partido {
  id: number;
  equipo_local: string;
  equipo_local_logo?: string | null;
  equipo_visitante: string;
  equipo_visitante_logo?: string | null;
  marcador_local: number;
  marcador_visitante: number;
  fecha: string;
  estado?: string;
}

const PartidoDetalle: React.FC = () => {
  const { partidoId } = useParams<{ partidoId: string }>();
  const [partido, setPartido] = useState<Partido | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetallePartido = async () => {
      try {
        const data = await getDetallePartido(Number(partidoId));
        setPartido(data);
      } catch (err) {
        console.error("Error al obtener detalles del partido:", err);
        setError("No se pudo cargar la información del partido.");
      }
    };
    fetchDetallePartido();
  }, [partidoId]);

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Detalle del Partido</h1>
      {error && <div className="alert alert-danger">{error}</div>}

      {partido ? (
        <div className="card shadow-lg">
          <div className="card-body text-center">
            <h3>
              {partido.equipo_local} vs {partido.equipo_visitante}
            </h3>
            <div className="d-flex justify-content-center align-items-center my-3">
              <img
                src={partido.equipo_local_logo || "https://via.placeholder.com/100"}
                alt={partido.equipo_local}
                className="img-thumbnail mx-2"
                style={{ width: "100px", height: "100px" }}
              />
              <span className="h4 mx-3">
                {partido.marcador_local} - {partido.marcador_visitante}
              </span>
              <img
                src={partido.equipo_visitante_logo || "https://via.placeholder.com/100"}
                alt={partido.equipo_visitante}
                className="img-thumbnail mx-2"
                style={{ width: "100px", height: "100px" }}
              />
            </div>
            <p>Fecha: {new Date(partido.fecha).toLocaleString()}</p>
            <p>Estado: {partido.estado}</p>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartidoDetalle;
