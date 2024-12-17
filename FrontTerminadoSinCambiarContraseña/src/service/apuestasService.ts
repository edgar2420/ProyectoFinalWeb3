import apuestasApi from "./apuestasApi";

// Interfaz para una Apuesta
export type ResultadoApostado = "local" | "visitante" | "empate";

export interface Apuesta {
  id: number;
  usuario_id: number;
  partido_id: number;
  monto: number;
  resultado_apostado: ResultadoApostado;
  fecha_apuesta: string;
  resultado_real?: ResultadoApostado;
  apuesta_resuelta: boolean;
}

// Interfaz para un Evento
export interface Evento {
  id: number;
  descripcion: string;
  minuto: number;
  equipo: string;
}

// Interfaz para Partido Detalle
export interface PartidoDetalle {
    id: number;
    equipo_local: string;
    equipo_local_logo?: string | null;
    equipo_visitante: string;
    equipo_visitante_logo?: string | null;
    marcador_local: number;
    marcador_visitante: number;
    fecha: string;
    estado?: string;
    eventos?: Evento[];
  }
  

// Obtener la lista de deportes
export const getDeportes = async () => {
  const response = await apuestasApi.get("/deportes/");
  return response.data;
};

// Obtener las ligas por deporte
export const getLigasPorDeporte = async (deporteId: number) => {
  const response = await apuestasApi.get(`/deportes/${deporteId}/ligas/`);
  return response.data;
};

// Obtener partidos por liga
export const getPartidosPorLiga = async (ligaId: number) => {
  const response = await apuestasApi.get(`/ligas/${ligaId}/partidos/`);
  return response.data;
};

// Obtener detalles de un partido específico
export const getDetallePartido = async (partidoId: number): Promise<PartidoDetalle> => {
    if (!partidoId || isNaN(partidoId)) {
      throw new Error("El ID del partido es inválido.");
    }
    const response = await apuestasApi.get(`/partidos/${partidoId}/`);
    return response.data;
  };
  

// Obtener eventos por partido
export const getEventosPorPartido = async (partidoId: number): Promise<Evento[]> => {
  const response = await apuestasApi.get(`/partidos/${partidoId}/eventos/`);
  return response.data;
};

// Crear una nueva apuesta
export const crearApuesta = async (partidoId: number, monto: number, resultado: string) => {
  const response = await apuestasApi.post(`/apuestas/partido/${partidoId}/`, {
    monto,
    resultado_apostado: resultado,
  });
  return response.data;
};

export const getLigas = async () => {
    const response = await apuestasApi.get("/ligas/");
    return response.data;
  };
  

export const getPartidos = async () => {
    const response = await apuestasApi.get("/partidos/");
    return response.data;
  };
  

// Obtener el historial de apuestas del cliente
export const getHistorialApuestas = async () => {
  const response = await apuestasApi.get("/apuestas/historial/");
  return response.data;
};
