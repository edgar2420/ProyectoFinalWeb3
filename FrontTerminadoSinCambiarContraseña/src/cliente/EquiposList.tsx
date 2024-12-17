import React, { useEffect, useState } from "react";
import { getEquiposCliente, getPartidosPorEquipo } from "../service/partidosService";
import Navbar from "./Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";

interface Equipo {
  id: number;
  nombre: string;
  logo?: string;
}

interface Partido {
  id: number;
  equipo_local: string;
  equipo_visitante: string;
  fecha: string;
  estado?: string;
}

const BASE_MEDIA_URL = "http://127.0.0.1:8001";

const EquiposList: React.FC = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const saldo = 1000.0;

  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [partidosEquipo, setPartidosEquipo] = useState<Partido[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchEquipos = async () => {
      try {
        setLoading(true);
        const data = await getEquiposCliente();
        setEquipos(data);
      } catch (err) {
        console.error("Error al obtener equipos:", err);
        setError("No se pudieron cargar los equipos.");
      } finally {
        setLoading(false);
      }
    };

    fetchEquipos();
  }, []);

  const handleEquipoClick = async (equipoId: number) => {
    try {
      const partidos = await getPartidosPorEquipo(equipoId);
      setPartidosEquipo(partidos);
      setShowModal(true);
    } catch (err) {
      console.error("Error al obtener partidos del equipo:", err);
      setError("No se pudieron cargar los partidos del equipo.");
    }
  };

  const getImageUrl = (logo: string | null | undefined): string => {
    if (!logo) return "https://via.placeholder.com/100?text=Sin+Logo";
    return logo.startsWith("http") ? logo : `${BASE_MEDIA_URL}${logo}`;
  };

  return (
    <div className="cliente-dashboard">
      <Navbar username={user.username || "Invitado"} saldo={saldo} />

      <div className="main-container">
        <h1 className="text-center mt-4">🏆 Equipos Disponibles</h1>

        {loading && (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        )}

        {error && <div className="alert alert-danger text-center">{error}</div>}

        {!loading && !error && equipos.length > 0 && (
          <div className="container mt-4">
            <div className="row g-4">
              {equipos.map((equipo) => (
                <div
                  key={equipo.id}
                  className="col-md-4"
                  onClick={() => handleEquipoClick(equipo.id)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="card shadow-sm border-0 rounded-3">
                    <div className="card-body text-center">
                      <img
                        src={getImageUrl(equipo.logo)}
                        alt={equipo.nombre}
                        className="rounded-circle mb-3"
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                          border: "2px solid #28a745",
                        }}
                      />
                      <h5 className="card-title">{equipo.nombre}</h5>
                      <button className="btn btn-success btn-sm">
                        Ver Partidos
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && !error && equipos.length === 0 && (
          <div className="alert alert-warning text-center mt-5">
            No hay equipos disponibles.
          </div>
        )}

        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Partidos del Equipo</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {partidosEquipo.length > 0 ? (
              <div>
                {partidosEquipo.map((partido) => (
                  <div key={partido.id} className="mb-2">
                    <strong>{partido.equipo_local}</strong> vs{" "}
                    <strong>{partido.equipo_visitante}</strong> -{" "}
                    {new Date(partido.fecha).toLocaleString()}
                  </div>
                ))}
              </div>
            ) : (
              <p>No hay partidos disponibles para este equipo.</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default EquiposList;
