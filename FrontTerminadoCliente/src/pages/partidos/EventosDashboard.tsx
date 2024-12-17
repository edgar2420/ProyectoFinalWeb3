import React, { useEffect, useState } from "react";
import {
  getEventos,
  deleteEvento,
  updateEvento,
  Evento,
} from "../../service/partidosService";

const EventosDashboard: React.FC = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingEvento, setEditingEvento] = useState<Evento | null>(null);
  const [formValues, setFormValues] = useState({
    descripcion: "",
    minuto: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const eventosData = await getEventos();
        setEventos(eventosData); // Asume que el backend devuelve los nombres de partidos y equipos resueltos
      } catch (error) {
        console.error("Error al cargar eventos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Estás seguro de eliminar este evento?")) {
      try {
        await deleteEvento(id);
        setEventos((prev) => prev.filter((evento) => evento.id !== id));
        alert("Evento eliminado correctamente");
      } catch (error) {
        console.error("Error al eliminar evento:", error);
      }
    }
  };

  const handleEdit = (evento: Evento) => {
    setEditingEvento(evento);
    setFormValues({
      descripcion: evento.descripcion,
      minuto: evento.minuto.toString(),
    });
  };

  const handleSave = async () => {
    if (!editingEvento) return;

    try {
      const updatedEvento = {
        ...editingEvento,
        descripcion: formValues.descripcion,
        minuto: parseInt(formValues.minuto, 10),
      };

      await updateEvento(editingEvento.id, updatedEvento);
      setEventos((prev) =>
        prev.map((evento) =>
          evento.id === editingEvento.id ? updatedEvento : evento
        )
      );
      setEditingEvento(null);
      alert("Evento actualizado correctamente");
    } catch (error) {
      console.error("Error al actualizar el evento:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">Gestión de Eventos</h1>
      {loading ? (
        <p className="text-center">Cargando...</p>
      ) : (
        <ul className="list-group">
          {eventos.map((evento) => (
            <li
              key={evento.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <p>
                  <strong>Partido:</strong> {evento.partido || "No definido"}
                </p>
                <p>
                  <strong>Descripción:</strong> {evento.descripcion}
                </p>
                <p>
                  <strong>Minuto:</strong> {evento.minuto}
                </p>
                <p>
                  <strong>Equipo:</strong> {evento.equipo || "No definido"}
                </p>
              </div>
              <div>
                <button
                  className="btn btn-sm btn-primary me-2"
                  onClick={() => handleEdit(evento)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(evento.id)}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Modal para editar evento */}
      {editingEvento && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Evento</h5>
                <button
                  className="btn-close"
                  onClick={() => setEditingEvento(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="descripcion" className="form-label">
                    Descripción
                  </label>
                  <input
                    type="text"
                    id="descripcion"
                    name="descripcion"
                    className="form-control"
                    value={formValues.descripcion}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="minuto" className="form-label">
                    Minuto
                  </label>
                  <input
                    type="number"
                    id="minuto"
                    name="minuto"
                    className="form-control"
                    value={formValues.minuto}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setEditingEvento(null)}
                >
                  Cancelar
                </button>
                <button className="btn btn-primary" onClick={handleSave}>
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

export default EventosDashboard;
