import React, { useState, useEffect } from "react";
import {
  getPartidos,
  createPartido,
  updatePartido,
  getLigas,
  getEquipos,
  deletePartido,
  Partido,
  Liga,
  Equipo,
} from "../../service/partidosService";
import { useNavigate } from "react-router-dom";
import "./PartidosDashboard.css";


const PartidosDashboard: React.FC = () => {
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [ligas, setLigas] = useState<Liga[]>([]);
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingPartido, setEditingPartido] = useState<Partido | null>(null);
  const [creatingPartido, setCreatingPartido] = useState(false);
  const [formValues, setFormValues] = useState({
    liga_id: "",
    equipo_local_id: "",
    equipo_visitante_id: "",
    fecha: "",
    marcador_local: 0,
    marcador_visitante: 0,
    estado: "PENDIENTE" as "PENDIENTE" | "EN_JUEGO" | "FINALIZADO" | "CANCELADO",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [partidosData, ligasData, equiposData] = await Promise.all([
          getPartidos(),
          getLigas(),
          getEquipos(),
        ]);
        setPartidos(partidosData);
        setLigas(ligasData);
        setEquipos(equiposData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEditPartido = (partido: Partido) => {
    setEditingPartido(partido);
    setFormValues({
      liga_id: partido.liga_id?.toString() || "",
      equipo_local_id: partido.equipo_local_id?.toString() || "",
      equipo_visitante_id: partido.equipo_visitante_id?.toString() || "",
      fecha: partido.fecha,
      marcador_local: partido.marcador_local,
      marcador_visitante: partido.marcador_visitante,
      estado: partido.estado as "PENDIENTE" | "EN_JUEGO" | "FINALIZADO" | "CANCELADO",
    });
  };

  const handleCreatePartido = () => {
    setCreatingPartido(true);
    setFormValues({
      liga_id: "",
      equipo_local_id: "",
      equipo_visitante_id: "",
      fecha: "",
      marcador_local: 0,
      marcador_visitante: 0,
      estado: "PENDIENTE" as "PENDIENTE" | "EN_JUEGO" | "FINALIZADO" | "CANCELADO",
    });
  };

  const handleDeletePartido = async (id: number) => {
    try {
      await deletePartido(id);
      setPartidos((prev) => prev.filter((partido) => partido.id !== id));
    } catch (error) {
      console.error("Error al eliminar el partido:", error);
    }
  };

  const handleSavePartido = async () => {
    try {
      if (editingPartido) {
        const updatedPartido = await updatePartido(editingPartido.id, {
          liga_id: parseInt(formValues.liga_id, 10),
          equipo_local_id: parseInt(formValues.equipo_local_id, 10),
          equipo_visitante_id: parseInt(formValues.equipo_visitante_id, 10),
          fecha: formValues.fecha,
          marcador_local: formValues.marcador_local,
          marcador_visitante: formValues.marcador_visitante,
          estado: formValues.estado,
        });
        setPartidos((prev) =>
          prev.map((partido) =>
            partido.id === updatedPartido.id ? updatedPartido : partido
          )
        );
        setEditingPartido(null);
      } else if (creatingPartido) {
        const newPartido = await createPartido({
          liga_id: parseInt(formValues.liga_id, 10),
          equipo_local_id: parseInt(formValues.equipo_local_id, 10),
          equipo_visitante_id: parseInt(formValues.equipo_visitante_id, 10),
          fecha: formValues.fecha,
          marcador_local: formValues.marcador_local,
          marcador_visitante: formValues.marcador_visitante,
          estado: formValues.estado,
        });
        setPartidos((prev) => [...prev, newPartido]);
        setCreatingPartido(false);
      }
    } catch (error) {
      console.error(
        editingPartido
          ? "Error al actualizar el partido"
          : "Error al crear el partido",
        error
      );
    }
  };
  

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: name.includes("marcador") ? parseInt(value, 10) || 0 : value,
    });
  };

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">Gestión de Partidos</h1>

      <div className="text-end mb-3">
        <button
          className="btn btn-primary me-2"
          onClick={() => navigate("/partidos/create-evento")}
        >
          Crear Evento
        </button>
        <button
          className="btn btn-secondary me-2"
          onClick={() => navigate("/partidos/create-liga")}
        >
          Crear Liga
        </button>
        <button
          className="btn btn-success me-2"
          onClick={() => navigate("/partidos/create-deporte")}
        >
          Crear Deporte
        </button>
        <button
          className="btn btn-info"
          onClick={() => navigate("/partidos/create-equipo")}
        >
          Crear Equipo
        </button>
      </div>

      <div className="text-end mb-3">
        <button className="btn btn-success" onClick={handleCreatePartido}>
          Crear Partido
        </button>
      </div>

      <div className="row">
        <div className="col-md-12">
          {loading ? (
            <p className="text-center">Cargando...</p>
          ) : (
            <ul className="list-group">
              {partidos.map((partido) => (
                <li
                  key={partido.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <strong>{partido.liga}</strong>
                    <p>
                      <img
                        src={`http://127.0.0.1:8001${partido.equipo_local_logo}`}
                        alt={`Logo ${partido.equipo_local}`}
                        style={{ height: "30px", marginRight: "10px" }}
                      />
                      {partido.equipo_local} vs{" "}
                      <img
                        src={`http://127.0.0.1:8001${partido.equipo_visitante_logo}`}
                        alt={`Logo ${partido.equipo_visitante}`}
                        style={{ height: "30px", marginRight: "10px" }}
                      />
                      {partido.equipo_visitante}
                    </p>
                    <p>Fecha: {new Date(partido.fecha).toLocaleDateString()}</p>
                    <p>Hora: {new Date(partido.fecha).toLocaleTimeString()}</p>
                    <p>
                      Marcador: {partido.marcador_local} -{" "}
                      {partido.marcador_visitante}
                    </p>
                    <p>
                      Estado: {partido.estado}
                    </p>
                  </div>
                  <div>
                    <button
                      className="btn btn-sm btn-primary me-2"
                      onClick={() => handleEditPartido(partido)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeletePartido(partido.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {(editingPartido || creatingPartido) && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingPartido ? "Editar Partido" : "Crear Partido"}
                </h5>
                <button
                  className="btn-close"
                  onClick={() => {
                    setEditingPartido(null);
                    setCreatingPartido(false);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="liga_id" className="form-label">
                    Liga
                  </label>
                  <select
                    id="liga_id"
                    name="liga_id"
                    className="form-control"
                    value={formValues.liga_id}
                    onChange={handleChange}
                  >
                    <option value="">Seleccione una liga</option>
                    {ligas.map((liga) => (
                      <option key={liga.id} value={liga.id}>
                        {liga.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="equipo_local_id" className="form-label">
                    Equipo Local
                  </label>
                  <select
                    id="equipo_local_id"
                    name="equipo_local_id"
                    className="form-control"
                    value={formValues.equipo_local_id}
                    onChange={handleChange}
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
                  <label htmlFor="equipo_visitante_id" className="form-label">
                    Equipo Visitante
                  </label>
                  <select
                    id="equipo_visitante_id"
                    name="equipo_visitante_id"
                    className="form-control"
                    value={formValues.equipo_visitante_id}
                    onChange={handleChange}
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
                  <label htmlFor="fecha" className="form-label">
                    Fecha y Hora
                  </label>
                  <input
                    type="datetime-local"
                    id="fecha"
                    name="fecha"
                    className="form-control"
                    value={formValues.fecha}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="marcador_local" className="form-label">
                    Marcador Local
                  </label>
                  <input
                    type="number"
                    id="marcador_local"
                    name="marcador_local"
                    className="form-control"
                    value={formValues.marcador_local}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="marcador_visitante" className="form-label">
                    Marcador Visitante
                  </label>
                  <input
                    type="number"
                    id="marcador_visitante"
                    name="marcador_visitante"
                    className="form-control"
                    value={formValues.marcador_visitante}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="estado" className="form-label">
                    Estado
                  </label>
                  <select
                    id="estado"
                    name="estado"
                    className="form-control"
                    value={formValues.estado}
                    onChange={handleChange}
                  >
                    <option value="PENDIENTE">Pendiente</option>
                    <option value="EN_JUEGO">En Juego</option>
                    <option value="FINALIZADO">Finalizado</option>
                    <option value="CANCELADO">Cancelado</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setEditingPartido(null);
                    setCreatingPartido(false);
                  }}
                >
                  Cancelar
                </button>
                <button className="btn btn-primary" onClick={handleSavePartido}>
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartidosDashboard;
