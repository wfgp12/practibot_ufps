import { mapApiStudentToStudent, mapStudentToApiPayload, type IApiStudent, type IStudent } from "@/models/IStudent";
import axiosClient from "./axiosClient";
import type { IApiPaginatedResponse, IApiResponse } from "@/models/IApi";

export const studentApi = {
  createStudent: async (payload: { nombre: string; email: string, codigo: string, documento: string }): Promise<IStudent> => {
    const response = await axiosClient.post<IApiResponse<IApiStudent>>("/estudiantes", payload);
    return mapApiStudentToStudent(response.data.data);
  },

  cargarMasivo: async (archivo: File): Promise<IApiResponse<unknown>> => {
    const formData = new FormData();
    formData.append("archivo", archivo);

    const response = await axiosClient.post<IApiResponse<unknown>>(
      "/estudiantes/cargar",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },

  getStudents: async (params: {
    skip?: number;
    take?: number;
    nombre?: string;
    email?: string;
    codigo?: string;
    documento?: string;
  }): Promise<IApiPaginatedResponse<IStudent>> => {
    const response = await axiosClient.get<IApiPaginatedResponse<IApiStudent>>(
      "/estudiantes",
      { params }
    );

    return {
      message: response.data.message,
      data: response.data.data.map(mapApiStudentToStudent),
      total: response.data.total,
      page: response.data.page,
      pageSize: response.data.pageSize,
    };
  },

  getStudentsForVacancy: async (vacancyId: number, params: {
    skip?: number;
    take?: number;
    nombre?: string;
    email?: string;
    codigo?: string;
    documento?: string;
  }): Promise<IApiPaginatedResponse<IStudent>> => {
    const response = await axiosClient.get<IApiPaginatedResponse<IApiStudent>>(
      `/estudiantes/vacancia/${vacancyId}`,
      { params }
    );

    return {
      message: response.data.message,
      data: response.data.data.map(mapApiStudentToStudent),
      total: response.data.total,
      page: response.data.page,
      pageSize: response.data.pageSize,
    };
  },

  getStudentById: async (id: number): Promise<IStudent> => {
    const response = await axiosClient.get<IApiResponse<IApiStudent>>(`/estudiantes/${id}`);
    return mapApiStudentToStudent(response.data.data);
  },

  updateStudent: async (id: number, payload: Partial<IStudent>): Promise<IStudent> => {
    const mappedPayload = mapStudentToApiPayload(payload);
    const response = await axiosClient.put<IApiResponse<IApiStudent>>(
      `/estudiantes/${id}`,
      mappedPayload
    );
    return mapApiStudentToStudent(response.data.data);
  },

  deactivateStudent: async (id: number): Promise<IStudent> => {
    const response = await axiosClient.patch<IApiResponse<IApiStudent>>(`/estudiantes/${id}/desactivar`);
    return mapApiStudentToStudent(response.data.data);
  },

  reactivateStudent: async (id: number): Promise<IStudent> => {
    const response = await axiosClient.patch<IApiResponse<IApiStudent>>(`/estudiantes/${id}/activar`);
    return mapApiStudentToStudent(response.data.data);
  },

  getMyProfile: async (): Promise<IStudent> => {
    const response = await axiosClient.get<IApiResponse<IApiStudent>>(`/estudiantes/me`);
    return mapApiStudentToStudent(response.data.data);
  },

  completeProfile: async (id: number, payload: Partial<IStudent>): Promise<IStudent> => {
    const response = await axiosClient.patch<IApiResponse<IApiStudent>>(
      `/estudiantes/${id}/completar-perfil`,
      { ...payload, perfilCompleto: true }
    );
    return mapApiStudentToStudent(response.data.data);
  },

  subirHojaDeVida: async (id: number, archivo: File) => {
    const formData = new FormData();
    formData.append("archivo", archivo);

    const response = await axiosClient.post<IApiResponse<{
      hojaVidaUrl: string,
      documentoId: number
    }>>(
      `/estudiantes/${id}/subirhoja`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },
};
