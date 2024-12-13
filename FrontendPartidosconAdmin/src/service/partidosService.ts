import partidosApi from "./partidosapi";

// Define los tipos para Partidos, Deportes, Ligas y Equipos
export interface Equipo {
  id: number;
  nombre: string;
}

export interface Liga {
  id: number;
  nombre: string;
}

export interface Deporte {
  id: number;
  nombre: string;
  logo?: string; // Opcional
}

export interface Partido {
  id: number;
  liga: string; // Nombre de la liga
  liga_id?: number; // ID de la liga (opcional, para escritura)
  equipo_local: string; // Nombre del equipo local
  equipo_local_id?: number; // ID del equipo local (opcional, para escritura)
  equipo_visitante: string; // Nombre del equipo visitante
  equipo_visitante_id?: number; // ID del equipo visitante (opcional, para escritura)
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

// Obtener todos los deportes
export const getDeportes = async (): Promise<Deporte[]> => {
  const response = await partidosApi.get<Deporte[]>("/deportes/");
  return response.data;
};

// Crear un nuevo deporte
export const createDeporte = async (data: FormData): Promise<Deporte> => {
  const response = await partidosApi.post<Deporte>("/deportes/", data);
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

// Función para obtener los equipos
export const getEquipos = async (): Promise<Equipo[]> => {
  const response = await partidosApi.get<Equipo[]>("/equipos/");
  return response.data;
};

// Eliminar un partido
export const deletePartido = async (id: number): Promise<void> => {
  await partidosApi.delete(`/partidos/${id}/`);
};

// Exportar todas las funciones
export default {
  getDeportes,
  createDeporte,
  getLigas,
  getEquipos,
  getPartidos,
  createPartido,
  updatePartido,
  deletePartido,
};
