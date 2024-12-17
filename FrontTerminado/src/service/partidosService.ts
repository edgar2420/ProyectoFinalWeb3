import partidosApi from "./partidosapi";

// Define los tipos para Partidos, Deportes, Ligas, Equipos y Eventos
export interface Equipo {
  id: number;
  nombre: string;
  logo?: string; // URL del logo opcional
}

export interface Evento {
  id: number; // ID del evento
  partido: string; // Nombre del partido (relación resuelta)
  equipo: string; // Nombre del equipo (relación resuelta)
  descripcion: string; // Descripción del evento
  minuto: number; // Minuto en el que ocurrió el evento
  partido_id?: number; // ID del partido (opcional, para edición)
  equipo_id?: number; // ID del equipo (opcional, para edición)
}


export interface Liga {
  id: number;
  nombre: string;
  deporte_id: number; // ID del deporte relacionado
  logo?: string; // URL del logo opcional
}

export interface Deporte {
  id: number;
  nombre: string;
  logo?: string; // URL del logo opcional
}

export interface Partido {
  id: number;
  liga: string; // Nombre de la liga
  liga_id?: number; // ID de la liga (opcional, para escritura)
  equipo_local: string; // Nombre del equipo local
  equipo_local_id?: number; // ID del equipo local (opcional, para escritura)
  equipo_local_logo?: string | null; // Logo del equipo local
  equipo_visitante: string; // Nombre del equipo visitante
  equipo_visitante_id?: number; // ID del equipo visitante (opcional, para escritura)
  equipo_visitante_logo?: string | null; // Logo del equipo visitante
  fecha: string; // Fecha en formato ISO
  marcador_local: number;
  marcador_visitante: number;
}


// Tipo para enviar datos al backend
export interface PartidoInput {
  liga_id: number; // ID de la liga
  fecha: string; // Fecha en formato ISO
  equipo_local_id: number; // ID del equipo local
  equipo_visitante_id: number; // ID del equipo visitante
  marcador_local: number;
  marcador_visitante: number;
}

// Tipo para enviar datos al backend para un evento
export interface EventoInput {
  partido_id: number; // ID del partido
  descripcion: string; // Descripción del evento
  minuto: number; // Minuto en que ocurrió el evento
  equipo_id: number; // ID del equipo relacionado al evento
}

// Tipo para enviar datos al backend para una liga
export interface LigaInput {
  nombre: string; // Nombre de la liga
  deporte_id: number; // ID del deporte relacionado
  logo?: File | null; // Archivo opcional para el logo
}

// Tipo para enviar datos al backend para un deporte
export interface DeporteInput {
  nombre: string; // Nombre del deporte
  logo?: File | null; // Archivo opcional para el logo
}

// Tipo para enviar datos al backend para un equipo
export interface EquipoInput {
  nombre: string; // Nombre del equipo
  logo?: File | null; // Archivo opcional para el logo
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

// Actualizar un partido (solo permite modificar campos específicos)
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

// Actualizar una liga con FormData
export const updateLiga = async (id: number, data: FormData): Promise<Liga> => {
  const response = await partidosApi.put<Liga>(`/ligas/${id}/`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};


// Exportar todas las funciones
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
  deleteEquipo,
  deleteEvento,
};
