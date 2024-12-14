import React, { useEffect, useState } from "react";
import { getEquipos, deleteEquipo, Equipo } from "../../service/partidosService";

const EquiposDashboard: React.FC = () => {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEquipos = async () => {
      setLoading(true);
      try {
        const data = await getEquipos();
        setEquipos(data);
      } catch (error) {
        console.error("Error al cargar equipos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipos();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteEquipo(id);
      setEquipos((prev) => prev.filter((equipo) => equipo.id !== id));
      alert("Equipo eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar equipo:", error);
    }
  };

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">Gestión de Equipos</h1>
      {loading ? (
        <p className="text-center">Cargando...</p>
      ) : (
        <ul className="list-group">
          {equipos.map((equipo) => (
            <li
              key={equipo.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div className="d-flex align-items-center">
                {/* Imagen del logo */}
                {equipo.logo && (
                  <img
                    src={`http://127.0.0.1:8001${equipo.logo}`} // URL base del backend
                    alt={equipo.nombre}
                    style={{ width: "50px", height: "50px", marginRight: "15px" }}
                  />
                )}
                <p className="mb-0">
                {equipo.nombre}
                </p>
              </div>
              <div>
                <a
                  href={`/equipos/${equipo.id}/edit`}
                  className="btn btn-sm btn-primary me-2"
                >
                  Editar
                </a>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(equipo.id)}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EquiposDashboard;
