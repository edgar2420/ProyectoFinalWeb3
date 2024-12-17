import React, { useState } from "react";
import api from "../../service/api";

const ChangePassword: React.FC = () => {
  const [userId, setUserId] = useState<number | null>(null); // ID del usuario
  const [newPassword, setNewPassword] = useState<string>(""); // Nueva contraseña

  const handlePasswordChange = async () => {
    if (!userId) {
      alert("Selecciona un usuario válido");
      return;
    }

    try {
      await api.post(`/users/${userId}/change-password/`, { new_password: newPassword });
      alert("Contraseña actualizada con éxito");
      setNewPassword("");
      setUserId(null);
    } catch (err) {
      console.error("Error al cambiar la contraseña:", err);
      alert("Error al cambiar la contraseña");
    }
  };

  return (
    <div>
      <h2>Cambiar Contraseña</h2>
      <input
        type="number"
        placeholder="ID del Usuario"
        value={userId || ""}
        onChange={(e) => setUserId(Number(e.target.value))}
      />
      <input
        type="password"
        placeholder="Nueva Contraseña"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button onClick={handlePasswordChange}>Actualizar Contraseña</button>
    </div>
  );
};

export default ChangePassword;
