import partidosApi from "./partidosapi";


export interface Equipo {
  id: number;
  nombre: string;
  logo?: string;
}

export interface Evento {
  id: number;
  partido: string;
  equipo: string;
  descripcion: string;
  minuto: number;
  partido_id?: number;
  equipo_id?: number;
}


export interface Liga {
  id: number;
  nombre: string;
  deporte_id: number;
  logo?: string;
}

export interface Deporte {
  id: number;
  nombre: string;
  logo?: string;
}

export interface Partido {
  estado: "PENDIENTE" | "EN_JUEGO" | "FINALIZADO" | "CANCELADO";
  id: number;
  liga: string;
  liga_id?: number;
  equipo_local: string;
  equipo_local_id?: number;
  equipo_local_logo?: string | null;
  equipo_visitante: string;
  equipo_visitante_id?: number;
  equipo_visitante_logo?: string | null;
  fecha: string;
  marcador_local: number;
  marcador_visitante: number;
}



export interface PartidoInput {
  liga_id: number;
  equipo_local_id: number;
  equipo_visitante_id: number;
  fecha: string;
  marcador_local: number;
  marcador_visitante: number;
  estado: "PENDIENTE" | "EN_JUEGO" | "FINALIZADO" | "CANCELADO";
}



export interface EventoInput {
  partido_id: number;
  descripcion: string;
  minuto: number;
  equipo_id: number;
}


export interface LigaInput {
  nombre: string;
  deporte_id: number;
  logo?: File | null;
}


export interface DeporteInput {
  nombre: string;
  logo?: File | null;
}


export interface EquipoInput {
  nombre: string;
  logo?: File | null;
}

// Obtener todos los deportes
export const getDeportes = async (): Promise<Deporte[]> => {
  const response = await partidosApi.get<Deporte[]>("/deportes/");
  return response.data;
};


// Crear un nuevo deporte
export const createDeporte = async (data: FormData): Promise<Deporte> => {
  const response = await partidosApi.post<Deporte>("/deportes/", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};


// Obtener todos los partidos
export const getPartidos = async (): Promise<Partido[]> => {
  const response = await partidosApi.get<Partido[]>("/partidos/");
  return response.data;
};

// Crear un nuevo partido
export const createPartido = async (data: PartidoInput): Promise<Partido> => {
  const response = await partidosApi.post<Partido>("/partidos/", data);
  return response.data;
};


// Actualizar un partido
export const updatePartido = async (
  id: number,
  data: Partial<PartidoInput>
): Promise<Partido> => {
  const response = await partidosApi.put<Partido>(`/partidos/${id}/`, data);
  return response.data;
};

// Función para obtener las ligas
export const getLigas = async (): Promise<Liga[]> => {
  const response = await partidosApi.get<Liga[]>("/ligas/");
  return response.data;
};

// Crear una nueva liga con FormData
export const createLiga = async (data: FormData): Promise<Liga> => {
  const response = await partidosApi.post<Liga>("/ligas/", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Crear un nuevo evento
export const createEvento = async (data: EventoInput): Promise<void> => {
  await partidosApi.post("/eventos/", data);
};

// Función para obtener los equipos
export const getEquipos = async (): Promise<Equipo[]> => {
  const response = await partidosApi.get<Equipo[]>("/equipos/");
  return response.data;
};


// Crear un nuevo equipo usando FormData
export const createEquipo = async (data: FormData): Promise<Equipo> => {
  const response = await partidosApi.post<Equipo>("/equipos/", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};


// Eliminar un partido
export const deletePartido = async (id: number): Promise<void> => {
  await partidosApi.delete(`/partidos/${id}/`);
};

// Eliminar un deporte
export const deleteDeporte = async (id: number): Promise<void> => {
  await partidosApi.delete(`/deportes/${id}/`);
};

// Eliminar una liga
export const deleteLiga = async (id: number): Promise<void> => {
  await partidosApi.delete(`/ligas/${id}/`);
};

// Eliminar un equipo
export const deleteEquipo = async (id: number): Promise<void> => {
  await partidosApi.delete(`/equipos/${id}/`);
};

export const getPartidosPorEquipo = async (id: number) => {
  const token = localStorage.getItem("token");
  const response = await partidosApi.get(`/api/equipos/${id}/partidos/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};


// Eliminar un evento
export const deleteEvento = async (id: number): Promise<void> => {
  await partidosApi.delete(`/eventos/${id}/`);
};

export const getEventos = async (): Promise<Evento[]> => {
  const response = await partidosApi.get<Evento[]>("/eventos/");
  return response.data;
};

//Edita evento
export const updateEvento = async (id: number, data: Partial<EventoInput>): Promise<void> => {
  await partidosApi.put(`/eventos/${id}/`, data);
};

export const updateDeporte = async (
  id: number,
  data: FormData
): Promise<Deporte> => {
  const response = await partidosApi.put<Deporte>(`/deportes/${id}/`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getEquiposCliente = async (): Promise<Equipo[]> => {
  const token = localStorage.getItem("token");
  const response = await partidosApi.get<Equipo[]>("/clientes/equipos/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};


export const updateLiga = async (id: number, data: FormData): Promise<Liga> => {
  const response = await partidosApi.put<Liga>(`/ligas/${id}/`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};


export default {
  getDeportes,
  updateLiga,
  updateDeporte,
  createDeporte,
  getLigas,
  createLiga,
  getEquipos,
  createEquipo,
  getPartidos,
  createPartido,
  updateEvento,
  createEvento,
  updatePartido,
  deletePartido,
  deleteDeporte,
  deleteLiga,
  getEquiposCliente,
  deleteEquipo,
  deleteEvento,
};
