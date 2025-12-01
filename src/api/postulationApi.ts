import axiosClient from "./axiosClient";
import { mapPostulationFromApi, mapPostulationsResponse, type IApiPostulation, type IApiPostulationsResponse, type IPostulation, } from "@/models/IPostulation";
import type { IApiResponse, IApiPaginatedResponse } from "@/models/IApi";

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

  postulateMultiple: async (
    vacanteId: number,
    estudianteIds: number[]
  ): Promise<ReturnType<typeof mapPostulationsResponse>> => {
    const response = await axiosClient.post<{ data: IApiPostulationsResponse }>(
      `/postulaciones/${vacanteId}/postulaciones`,
      { estudianteIds }
    );

    // Convertir la respuesta completa
    return mapPostulationsResponse(response.data.data);
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
  ) => {
    const params: Record<string, unknown> = {};
    if (estado) params.estado = estado;
    if (page) params.page = page;
    if (limit) params.limit = limit;

    const response = await axiosClient.get(`/postulaciones/vacante/${vacanteId}`, { params });
    return {
      data: response.data.data.map(mapPostulationFromApi),
      total: response.data.total,
      page: response.data.page,
      pageSize: response.data.pageSize,
    };
  },

  getByCompany: async (
    filtros?: {
      vacante?: string;
      estado?: Postulation["estado"];
      estudiante?: string;
      fechaPostula?: string; // formato "YYYY-MM-DD"
      page?: number;
      limit?: number;
    }
  ) => {
    const params: Record<string, unknown> = {};

    if (filtros?.vacante) params.vacante = filtros.vacante;
    if (filtros?.estado) params.estado = filtros.estado;
    if (filtros?.estudiante) params.estudiante = filtros.estudiante;
    if (filtros?.fechaPostula) params.fechaPostula = filtros.fechaPostula;
    if (filtros?.page) params.page = filtros.page;
    if (filtros?.limit) params.limit = filtros.limit;

    const response = await axiosClient.get<IApiPaginatedResponse<IApiPostulation>>("/postulaciones/empresa", { params });
    return {
      data: response.data.data.map(mapPostulationFromApi),
      total: response.data.total,
      page: response.data.page,
      pageSize: response.data.pageSize,
    };
  },

  updateStatus: async (
    postulationId: number,
    estado: Postulation["estado"]
  ): Promise<IPostulation> => {
    const response = await axiosClient.patch<IApiResponse<IApiPostulation>>(
      `/postulaciones/${postulationId}/estado`,
      { estado }
    );

    // Mapear a tu modelo de frontend
    return mapPostulationFromApi(response.data.data);
  },

  getById: async (postulationId: number): Promise<IPostulation> => {
  const response = await axiosClient.get<IApiResponse<IApiPostulation>>(
    `/postulaciones/${postulationId}`
  );

  return mapPostulationFromApi(response.data.data);
},
};
