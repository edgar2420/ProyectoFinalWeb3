import React, { useState, useEffect } from "react";
import { getDeportes, createLiga, Deporte } from "../../service/partidosService";
import { useNavigate } from "react-router-dom";

const CreateLiga: React.FC = () => {
  const [nombre, setNombre] = useState("");
  const [deporteId, setDeporteId] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [deportes, setDeportes] = useState<Deporte[]>([]); // Tipo explícito
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Para redirigir

  useEffect(() => {
    const fetchDeportes = async () => {
      try {
        const data = await getDeportes();
        setDeportes(data); // Sin errores porque deportes tiene un tipo explícito
      } catch (error) {
        console.error("Error al cargar deportes:", error);
      }
    };

    fetchDeportes();
  }, []);

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
    formData.append("deporte_id", deporteId); // Pasa correctamente deporteId
    if (logo) formData.append("logo", logo);

    try {
      await createLiga(formData); // Ahora acepta FormData
      alert("Liga creada con éxito");
      setNombre("");
      setDeporteId("");
      setLogo(null);
    } catch (error) {
      console.error("Error al crear liga:", error);
      alert("Error al crear liga");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Crear Liga</h1>
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/liga-dashboard")} // Redirige a /liga-dashboard
        >
          Ir a Ligas
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">
            Nombre de la Liga
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
          <label htmlFor="deporte" className="form-label">
            Deporte
          </label>
          <select
            id="deporte"
            className="form-control"
            value={deporteId}
            onChange={(e) => setDeporteId(e.target.value)}
            required
          >
            <option value="">Seleccione un deporte</option>
            {deportes.map((deporte) => (
              <option key={deporte.id} value={deporte.id}>
                {deporte.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="logo" className="form-label">
            Logo de la Liga (opcional)
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
          {loading ? "Creando..." : "Crear Liga"}
        </button>
      </form>
    </div>
  );
};

export default CreateLiga;
