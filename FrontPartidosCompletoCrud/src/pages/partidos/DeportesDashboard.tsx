import React, { useEffect, useState } from "react";
import {
  getDeportes,
  deleteDeporte,
  updateDeporte,
  Deporte,
} from "../../service/partidosService";

const BASE_URL = "http://127.0.0.1:8001/";

const DeportesDashboard: React.FC = () => {
  const [deportes, setDeportes] = useState<Deporte[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingDeporte, setEditingDeporte] = useState<Deporte | null>(null);
  const [formValues, setFormValues] = useState({
    nombre: "",
    logo: null as File | null,
  });

  useEffect(() => {
    const fetchDeportes = async () => {
      setLoading(true);
      try {
        const data = await getDeportes();
        setDeportes(data);
      } catch (error) {
        console.error("Error al cargar deportes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeportes();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteDeporte(id);
      setDeportes((prev) => prev.filter((deporte) => deporte.id !== id));
      alert("Deporte eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar deporte:", error);
    }
  };

  const handleEdit = (deporte: Deporte) => {
    setEditingDeporte(deporte);
    setFormValues({
      nombre: deporte.nombre,
      logo: null,
    });
  };

  const handleSave = async () => {
    if (!editingDeporte) return;

    const formData = new FormData();
    formData.append("nombre", formValues.nombre);
    if (formValues.logo) {
      formData.append("logo", formValues.logo);
    }

    try {
      const updatedDeporte = await updateDeporte(editingDeporte.id, formData);
      setDeportes((prev) =>
        prev.map((deporte) =>
          deporte.id === editingDeporte.id ? updatedDeporte : deporte
        )
      );
      setEditingDeporte(null);
      alert("Deporte actualizado correctamente");
    } catch (error) {
      console.error("Error al actualizar deporte:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: name === "logo" && e.target instanceof HTMLInputElement && e.target.files
        ? e.target.files[0]
        : value,
    });
  };

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">Gestión de Deportes</h1>
      {loading ? (
        <p className="text-center">Cargando...</p>
      ) : (
        <ul className="list-group">
          {deportes.map((deporte) => (
            <li
              key={deporte.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <p>
                  <strong>Nombre:</strong> {deporte.nombre}
                </p>
                {deporte.logo && (
                  <img
                    src={`${BASE_URL}${deporte.logo}`}
                    alt={`Logo de ${deporte.nombre}`}
                    style={{ width: "50px", height: "50px", objectFit: "contain" }}
                  />
                )}
              </div>
              <div>
                <button
                  className="btn btn-sm btn-primary me-2"
                  onClick={() => handleEdit(deporte)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(deporte.id)}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Modal para editar deporte */}
      {editingDeporte && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Deporte</h5>
                <button
                  className="btn-close"
                  onClick={() => setEditingDeporte(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="nombre" className="form-label">
                    Nombre del Deporte
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
                    Logo del Deporte (opcional)
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
                  onClick={() => setEditingDeporte(null)}
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

export default DeportesDashboard;
