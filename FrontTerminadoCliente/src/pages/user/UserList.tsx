import React, { useEffect, useState } from "react";
import api from "../../service/api";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Importar estilos de Bootstrap
import { Modal, Button } from "react-bootstrap"; // Componentes de Bootstrap
import { AxiosError } from "axios"; // Importar tipo AxiosError para manejar errores

// Define la estructura de un usuario
interface User {
  id: number;
  username: string;
  email: string;
  roles: string[];
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]); // Lista de usuarios
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado del modal
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // Usuario seleccionado
  const [newRole, setNewRole] = useState<string>(""); // Nuevo rol seleccionado
  const [loading, setLoading] = useState<boolean>(false); // Estado de carga

  // Cargar usuarios al montar el componente
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await api.get<User[]>("/users/");
        setUsers(response.data);
      } catch (error: unknown) {
        const axiosError = error as AxiosError; // Aseguramos que error es un AxiosError
        console.error("Error al cargar usuarios:", axiosError.response?.data || axiosError.message);
        alert("No se pudo cargar la lista de usuarios.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Eliminar usuario
  const handleDelete = async (userId: number) => {
    if (confirm("¿Estás seguro de eliminar este usuario?")) {
      try {
        const response = await api.delete(`/users/${userId}/delete/`);
        if (response.status === 200) {
          setUsers(users.filter((user) => user.id !== userId));
          alert("Usuario eliminado con éxito");
        }
      } catch (error: unknown) {
        const axiosError = error as AxiosError;
        console.error("Error al eliminar usuario:", axiosError.response?.data || axiosError.message);
        alert("Ocurrió un error al eliminar el usuario.");
      }
    }
  };

  // Abrir modal para cambiar rol
  const openRoleModal = (user: User) => {
    setSelectedUser(user);
    setNewRole(user.roles[0] || ""); // Preseleccionar el primer rol
    setIsModalOpen(true);
  };

  // Cerrar modal
  const closeRoleModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setNewRole("");
  };

  // Cambiar rol del usuario
  const handleRoleChange = async () => {
    if (!selectedUser) return;

    try {
        const response = await api.post(`/users/${selectedUser.id}/assign-role/`, {
            role: newRole,
        });
        if (response.status === 200) {
            alert("Rol cambiado con éxito");
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === selectedUser.id
                        ? { ...user, roles: [newRole] }
                        : user
                )
            );
            closeRoleModal();
        }
    } catch (error) {
        console.error("Error al cambiar rol:", error);
        alert("No se pudo cambiar el rol.");
    }
};



  return (
    <div className="container mt-4">
      <h1>Gestión de Usuarios</h1>
      <Link to="/users/create" className="btn btn-primary mb-3">
        Crear Usuario
      </Link>
      {loading ? (
        <p>Cargando usuarios...</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Roles</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.roles.join(", ")}</td>
                <td>
                  <Link
                    to={`/users/${user.id}/edit`}
                    className="btn btn-warning btn-sm me-2"
                  >
                    Editar
                  </Link>
                  <button
                    className="btn btn-danger btn-sm me-2"
                    onClick={() => handleDelete(user.id)}
                  >
                    Eliminar
                  </button>
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => openRoleModal(user)}
                  >
                    Cambiar Rol
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal para cambiar rol */}
      <Modal show={isModalOpen} onHide={closeRoleModal}>
        <Modal.Header closeButton>
          <Modal.Title>Cambiar Rol</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <>
              <p>
                Cambiar el rol de <strong>{selectedUser.username}</strong>
              </p>
              <select
                className="form-select"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
              >
                <option value="">Selecciona un rol</option>
                <option value="cliente">Cliente</option>
                <option value="recarga">Recarga</option>
                <option value="admin_partidos">
                  Administrador de Partidos
                </option>
                <option value="admin_usuarios">Administrador de Usuarios</option>
              </select>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeRoleModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleRoleChange}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserList;
