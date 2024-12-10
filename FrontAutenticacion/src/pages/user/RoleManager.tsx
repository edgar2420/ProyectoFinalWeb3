import React, { useState, useEffect } from "react";
import api from "../../service/api";

interface RoleManagerProps {
  userId: number; // ID del usuario para asignar o quitar roles
}

const RoleManager: React.FC<RoleManagerProps> = ({ userId }) => {
  const [role, setRole] = useState<string>(""); // Rol seleccionado
  const [availableRoles, setAvailableRoles] = useState<string[]>([]); // Lista de roles disponibles

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await api.get("/roles/"); // Correcto
        setAvailableRoles(response.data);
      } catch (err) {
        console.error("Error al cargar roles:", err);
        alert("No se pudieron cargar los roles.");
      }
    };
    fetchRoles();
  }, []);
  

  const assignRole = async () => {
    try {
      await api.post(`/users/${userId}/assign-role/${role}/`);
      alert("Rol asignado con éxito");
    } catch (err) {
      console.error("Error al asignar rol:", err);
      alert("No se pudo asignar el rol.");
    }
  };
  
  const removeRole = async () => {
    try {
      await api.post(`/users/${userId}/remove-role/${role}/`);
      alert("Rol eliminado con éxito");
    } catch (err) {
      console.error("Error al quitar rol:", err);
      alert("No se pudo quitar el rol.");
    }
  };
  

  return (
    <div>
      <h2>Gestionar Roles</h2>
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="">Selecciona un rol</option>
        {availableRoles.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
      <button onClick={assignRole}>Asignar Rol</button>
      <button onClick={removeRole}>Quitar Rol</button>
    </div>
  );
};

export default RoleManager;
