import { mapApiStudentToStudent, mapStudentToApiPayload, type IApiStudent, type IStudent } from "@/models/IStudent";
import axiosClient from "./axiosClient";
import type { IApiPaginatedResponse, IApiResponse } from "@/models/IApi";

export const studentApi = {
  createStudent: async (payload: { nombre: string; email: string }): Promise<IStudent> => {
    const response = await axiosClient.post<IApiResponse<IApiStudent>>("/estudiantes", payload);
    return mapApiStudentToStudent(response.data.data);
  },

  getStudents: async (skip = 0, take = 10): Promise<IApiPaginatedResponse<IStudent>> => {
    const response = await axiosClient.get<IApiPaginatedResponse<IApiStudent>>(
      `/estudiantes?skip=${skip}&take=${take}`
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
};
