import React, { useEffect, useState } from "react";
import api from "../../service/api";
import { Link } from "react-router-dom";
import { AxiosError } from "axios"; // Importar el tipo AxiosError

// Define la estructura de un usuario
interface User {
  id: number;
  username: string;
  email: string;
  roles: string[];
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]); // Especifica el tipo User[]

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get<User[]>("/users/"); // Especificamos que el tipo de respuesta es User[]
        setUsers(response.data);
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
        alert("No se pudo cargar la lista de usuarios.");
      }
    };
    fetchUsers();
  }, []);
  const handleDelete = async (userId: number) => {
    if (confirm("¿Estás seguro de eliminar este usuario?")) {
      try {
        console.log(`Eliminando usuario con ID: ${userId}`); // Verifica el ID
        const response = await api.delete(`/users/${userId}/delete/`); // Asegúrate de que esta URL sea correcta
        if (response.status === 200) {
          setUsers(users.filter((user) => user.id !== userId));
          alert("Usuario eliminado con éxito");
        }
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error("Error al eliminar usuario:", axiosError);
        if (axiosError.response && axiosError.response.status === 404) {
          alert("Usuario no encontrado.");
        } else if (axiosError.response && axiosError.response.status === 403) {
          alert("No tienes permisos para eliminar este usuario.");
        } else {
          alert("Ocurrió un error al eliminar el usuario.");
        }
      }
    }
  };
  
  return (
    <div>
      <h1>Gestión de Usuarios</h1>
      <Link to="/users/create">Crear Usuario</Link>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.username} - {user.email} - {user.roles.join(", ")}
            <Link to={`/users/${user.id}/edit`}>Editar</Link>
            <button onClick={() => handleDelete(user.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
