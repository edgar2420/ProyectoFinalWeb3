import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPartidos, getEquipos, createEvento, Partido, Equipo } from "../../service/partidosService";

const CreateEvento: React.FC = () => {
  const [descripcion, setDescripcion] = useState("");
  const [minuto, setMinuto] = useState(0);
  const [partidoId, setPartidoId] = useState("");
  const [equipoId, setEquipoId] = useState("");
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // Hook para navegación

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [partidosData, equiposData] = await Promise.all([
          getPartidos(),
          getEquipos(),
        ]);
        setPartidos(partidosData);
        setEquipos(equiposData);
      } catch (error) {
        console.error("Error al cargar partidos o equipos:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createEvento({
        partido_id: parseInt(partidoId, 10),
        descripcion,
        minuto,
        equipo_id: parseInt(equipoId, 10),
      });
      alert("Evento creado con éxito");
      setDescripcion("");
      setMinuto(0);
      setPartidoId("");
      setEquipoId("");
    } catch (error) {
      console.error("Error al crear evento:", error);
      alert("Error al crear evento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">Crear Evento</h1>
      <div className="text-end mb-4">
        {/* Botón para redirigir a /evento-dashboard */}
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/evento-dashboard")}
        >
          Ir a Gestión de Eventos
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="partido" className="form-label">Partido</label>
          <select
            id="partido"
            className="form-control"
            value={partidoId}
            onChange={(e) => setPartidoId(e.target.value)}
            required
          >
            <option value="">Seleccione un partido</option>
            {partidos.map((partido) => (
              <option key={partido.id} value={partido.id}>
                {`${partido.equipo_local} vs ${partido.equipo_visitante} - ${new Date(partido.fecha).toLocaleDateString()}`}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="equipo" className="form-label">Equipo</label>
          <select
            id="equipo"
            className="form-control"
            value={equipoId}
            onChange={(e) => setEquipoId(e.target.value)}
            required
          >
            <option value="">Seleccione un equipo</option>
            {equipos.map((equipo) => (
              <option key={equipo.id} value={equipo.id}>
                {equipo.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="descripcion" className="form-label">Descripción del Evento</label>
          <input
            type="text"
            id="descripcion"
            className="form-control"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="minuto" className="form-label">Minuto del Evento</label>
          <input
            type="number"
            id="minuto"
            className="form-control"
            value={minuto}
            onChange={(e) => setMinuto(parseInt(e.target.value, 10) || 0)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Creando..." : "Crear Evento"}
        </button>
      </form>
    </div>
  );
};

export default CreateEvento;
