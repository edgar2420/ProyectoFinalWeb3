import React, { useState } from "react";
import { createDeporte } from "../../service/partidosService";

const CreatePartido: React.FC = () => {
  const [nombre, setNombre] = useState("");
  const [logo, setLogo] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nombre", nombre);
    if (logo) {
      formData.append("logo", logo);
    }

    try {
      await createDeporte(formData);
      alert("Deporte creado con éxito");
      setNombre("");
      setLogo(null);
    } catch (error) {
      console.error("Error al crear el deporte:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Crear Deporte</h1>
      <div>
        <label>Nombre:</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Logo:</label>
        <input
          type="file"
          onChange={(e) => setLogo(e.target.files?.[0] || null)}
        />
      </div>
      <button type="submit">Crear</button>
    </form>
  );
};

export default CreatePartido;
