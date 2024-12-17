import React, { useState } from "react";
import { createEquipo } from "../../service/partidosService";
import { useNavigate } from "react-router-dom";

const CreateEquipo: React.FC = () => {
  const [nombre, setNombre] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Para redirigir

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogo(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("nombre", nombre);
    if (logo) formData.append("logo", logo);

    try {
      await createEquipo(formData);
      alert("Equipo creado con éxito");
      setNombre("");
      setLogo(null);
    } catch (error) {
      console.error("Error al crear equipo:", error);
      alert("Error al crear equipo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Crear Equipo</h1>
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/equipos-dashboard")} // Redirige a /equipos-dashboard
        >
          Ir a Equipos
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">
            Nombre del Equipo
          </label>
          <input
            type="text"
            id="nombre"
            className="form-control"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="logo" className="form-label">
            Logo del Equipo (opcional)
          </label>
          <input
            type="file"
            id="logo"
            className="form-control"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Creando..." : "Crear Equipo"}
        </button>
      </form>
    </div>
  );
};

export default CreateEquipo;
