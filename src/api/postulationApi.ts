import axiosClient from "./axiosClient";

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
}

export interface Estudiante {
  id: number;
  usuarioId: number;
  codigo: string;
  cedula: string;
  telefono: string;
  descripcion: string;
  area: string;
  habilidadesTecnicas: string[];
  habilidadesBlandas: string[];
  experiencia: string;
  perfilCompleto: boolean;
  activo: boolean;
  usuario: Usuario;
}

export interface Empresa {
  id: number;
  usuarioId: number;
  nit: string;
  telefono: string;
  direccion: string;
  sector: string;
  descripcion: string;
  estado: string;
  habilitada: boolean;
  directorId: number;
  usuario: Usuario;
}

export interface Vacante {
  id: number;
  empresaId: number;
  convenioId: number | null;
  directorValidaId: number | null;
  titulo: string;
  modalidad: string;
  descripcion: string;
  area: string;
  ciudad: string | null;
  habilidadesTecnicas: string[];
  habilidadesBlandas: string[];
  estado: string;
  creadaEn: string;
  actualizadaEn: string;
  empresa: Empresa;
}

export interface Postulation {
  id: number;
  estudianteId: number;
  vacanteId: number;
  comentario?: string | null;
  estado: "EN_REVISION" | "ACEPTADA" | "RECHAZADA" | "CANCELADA";
  fechaPostula: string;
  estudiante?: Estudiante;
  vacante?: Vacante;
}

export interface CreatePostulationDTO {
  vacanteId: number;
  comentario?: string;
}

export const PostulationApi = {
  create: async (data: CreatePostulationDTO): Promise<Postulation> => {
    const response = await axiosClient.post<{ data: Postulation }>("/postulaciones/crear", data);
    return response.data.data;
  },

  getMine: async (
    estado?: Postulation["estado"],
    page?: number,
    limit?: number
  ): Promise<{ data: Postulation[]; total: number; page: number; limit: number; totalPages: number }> => {
    const params: Record<string, unknown> = {};
    if (estado) params.estado = estado;
    if (page) params.page = page;
    if (limit) params.limit = limit;

    const response = await axiosClient.get("/postulaciones/mis-postulaciones", { params });
    return response.data;
  },

  cancel: async (postulationId: number): Promise<Postulation> => {
    const response = await axiosClient.patch<{ data: Postulation }>(`/postulaciones/${postulationId}/cancelar`);
    return response.data.data;
  },

  getByVacancy: async (
    vacanteId: number,
    estado?: Postulation["estado"],
    page?: number,
    limit?: number
  ): Promise<{ data: Postulation[]; total: number; page: number; limit: number; totalPages: number }> => {
    const params: Record<string, unknown> = {};
    if (estado) params.estado = estado;
    if (page) params.page = page;
    if (limit) params.limit = limit;

    const response = await axiosClient.get(`/postulaciones/vacante/${vacanteId}`, { params });
    return response.data;
  },
};
