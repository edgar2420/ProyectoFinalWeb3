import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Partido {
  id: number;
  liga: string;
  equipo_local: string;
  equipo_local_logo?: string;
  equipo_visitante: string;
  equipo_visitante_logo?: string;
  fecha: string;
  estado: string;
}

const BASE_URL = "http://127.0.0.1:8001/api/clientes/equipos";

const PartidosEquipo: React.FC = () => {
  const { equipoId } = useParams<{ equipoId: string }>(); // Obtener el equipoId de la URL
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPartidos = async () => {
      try {
        setLoading(true);

        // Obtener el token del localStorage
        const token = localStorage.getItem("token");

        const response = await fetch(`${BASE_URL}/${equipoId}/partidos/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Agregar el token aquí
          },
        });

        if (!response.ok) {
          throw new Error("No se pudieron cargar los partidos");
        }

        const data = await response.json();
        console.log("Datos de los partidos:", data);
        setPartidos(data.partidos_pasados || []); // Ajusta según tu estructura
      } catch (err) {
        console.error(err);
        setError("Error al obtener los partidos del equipo.");
      } finally {
        setLoading(false);
      }
    };

    fetchPartidos();
  }, [equipoId]);

  return (
    <div className="container mt-4">
      <h1 className="text-center">Partidos del Equipo</h1>

      {loading && <div>Cargando...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && partidos.length > 0 && (
        <ul className="list-group">
          {partidos.map((partido) => (
            <li key={partido.id} className="list-group-item">
              <div>
                <strong>{partido.equipo_local}</strong> vs{" "}
                <strong>{partido.equipo_visitante}</strong>
              </div>
              <div>Fecha: {new Date(partido.fecha).toLocaleString()}</div>
              <div>Estado: {partido.estado}</div>
            </li>
          ))}
        </ul>
      )}

      {!loading && partidos.length === 0 && (
        <div>No hay partidos disponibles para este equipo.</div>
      )}
    </div>
  );
};

export default PartidosEquipo;
