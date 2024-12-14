import React, { useEffect, useState } from "react";
import {
  getLigas,
  deleteLiga,
  updateLiga,
  Liga,
} from "../../service/partidosService";

const LigasDashboard: React.FC = () => {
  const [ligas, setLigas] = useState<Liga[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingLiga, setEditingLiga] = useState<Liga | null>(null);
  const [formValues, setFormValues] = useState({
    nombre: "",
    logo: null as File | null,
  });

  useEffect(() => {
    const fetchLigas = async () => {
      setLoading(true);
      try {
        const data = await getLigas();
        setLigas(data);
      } catch (error) {
        console.error("Error al cargar ligas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLigas();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Estás seguro de eliminar esta liga?")) {
      try {
        await deleteLiga(id);
        setLigas((prev) => prev.filter((liga) => liga.id !== id));
        alert("Liga eliminada correctamente");
      } catch (error) {
        console.error("Error al eliminar liga:", error);
      }
    }
  };

  const handleEdit = (liga: Liga) => {
    setEditingLiga(liga);
    setFormValues({
      nombre: liga.nombre,
      logo: null,
    });
  };

  const handleSave = async () => {
    if (!editingLiga) return;

    const formData = new FormData();
    formData.append("nombre", formValues.nombre);
    if (formValues.logo) {
      formData.append("logo", formValues.logo);
    }

    try {
      const updatedLiga = await updateLiga(editingLiga.id, formData);
      setLigas((prev) =>
        prev.map((liga) => (liga.id === editingLiga.id ? updatedLiga : liga))
      );
      setEditingLiga(null);
      alert("Liga actualizada correctamente");
    } catch (error) {
      console.error("Error al actualizar la liga:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === "logo" && files && files[0]) {
      setFormValues({
        ...formValues,
        logo: files[0],
      });
    } else {
      setFormValues({
        ...formValues,
        [name]: value,
      });
    }
  };

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">Gestión de Ligas</h1>
      {loading ? (
        <p className="text-center">Cargando...</p>
      ) : (
        <ul className="list-group">
          {ligas.map((liga) => (
            <li
              key={liga.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <p>
                  <strong>Nombre:</strong> {liga.nombre}
                </p>
                {liga.logo && (
                  <div>
                    <img
                      src={`http://localhost:8001${liga.logo}`}
                      alt={`Logo de ${liga.nombre}`}
                      style={{ maxWidth: "100px", height: "auto" }}
                    />
                  </div>
                )}
              </div>
              <div>
                <button
                  className="btn btn-sm btn-primary me-2"
                  onClick={() => handleEdit(liga)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(liga.id)}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Modal para editar liga */}
      {editingLiga && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Liga</h5>
                <button
                  className="btn-close"
                  onClick={() => setEditingLiga(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="nombre" className="form-label">
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    className="form-control"
                    value={formValues.nombre}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="logo" className="form-label">
                    Logo (opcional)
                  </label>
                  <input
                    type="file"
                    id="logo"
                    name="logo"
                    className="form-control"
                    accept="image/*"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setEditingLiga(null)}
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

export default LigasDashboard;
