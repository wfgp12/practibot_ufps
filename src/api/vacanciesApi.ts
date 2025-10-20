import type { IApiPaginatedResponse } from "@/models/IApi";
import axiosClient from "./axiosClient";
import { mapApiVacancies, mapFormToApiRegisterVacancy, mapFormToApiVacancy, type IApiVacancy, type IFormCreateVacancy, type IFormRegisterVacancy, type Vacancy } from "@/models/IVacancy";

interface ApiResponse<T> {
    message: string;
    data: T;
    total: number;
}

export const vacanciesApi = {
    /** 🟢 Obtener vacantes aprobadas (con filtros y paginación) */
    async getApproved(params?: {
        page?: number;
        limit?: number;
        titulo?: string;
        empresa?: string;
        estado?: string;
        modalidad?: string;
    }): Promise<IApiPaginatedResponse<Vacancy>> {
        const { data } = await axiosClient.get<IApiPaginatedResponse<IApiVacancy>>(
            "/vacantes/aprobadas",
            { params }
        );
        const pageSize = params?.limit ?? 10;

        return {
            data: mapApiVacancies(data.data),
            total: data.total,
            page: data.page,
            pageSize, // ✅ agregado para cumplir con la interfaz
        };
    },

    /** 🟡 Obtener vacantes pendientes (con filtros y paginación) */
    async getPending(params?: {
        page?: number;
        limit?: number;
        titulo?: string;
        empresa?: string;
        modalidad?: string;
    }): Promise<IApiPaginatedResponse<Vacancy>> {
        const { data } = await axiosClient.get<IApiPaginatedResponse<IApiVacancy>>(
            "/vacantes/pendientes",
            { params }
        );
        const pageSize = params?.limit ?? 10;

        return {
            data: mapApiVacancies(data.data),
            total: data.total,
            page: data.page,
            pageSize, // ✅ agregado
        };
    },

    /** 🆕 Crear una nueva vacante */
    async create(vacancy: IFormCreateVacancy): Promise<Vacancy> {
        const payload = mapFormToApiVacancy(vacancy);
        const { data } = await axiosClient.post<ApiResponse<IApiVacancy>>(
            "/vacantes/crear",
            payload
        );

        return mapApiVacancies([data.data])[0];
    },

    async registerApproved(form: IFormRegisterVacancy): Promise<Vacancy> {
        const payload = mapFormToApiRegisterVacancy(form);
        const { data } = await axiosClient.post<ApiResponse<IApiVacancy>>(
            "/vacantes/registrar",
            payload
        );
        return mapApiVacancies([data.data])[0];
    },

    /** 🟡 Actualizar vacante (solo ADMIN o DIRECTOR) */
    async updateAdminDirector(idVacancy: string, vacancy: IFormCreateVacancy | Partial<IFormCreateVacancy>): Promise<Vacancy> {
        const payload = mapFormToApiRegisterVacancy(vacancy); // o crea un map específico si quieres
        const { data } = await axiosClient.put<ApiResponse<IApiVacancy>>(
            `/vacantes/${idVacancy}/editar`,
            payload
        );

        return mapApiVacancies([data.data])[0];
    },

    async getById(id: string): Promise<Vacancy> {
        const { data } = await axiosClient.get<ApiResponse<IApiVacancy>>(`/vacantes/${id}`);
        return mapApiVacancies([data.data])[0];
    },

    /** 🟣 Aprobar vacante pendiente */
    async approve(id: string): Promise<void> {
        await axiosClient.patch(`/vacantes/${id}/aprobar`);
    },

    /** 🔴 Rechazar una vacante */
    async reject(id: string): Promise<void> {
        await axiosClient.patch(`/vacantes/${id}/rechazar`);
    },

    /** 🟢 Activar vacante inactiva */
    async activate(id: string): Promise<void> {
        await axiosClient.patch(`/vacantes/${id}/activar`);
    },

    /** 🔴 Inactivar vacante activa */
    async inactivate(id: string): Promise<void> {
        await axiosClient.patch(`/vacantes/${id}/inactivar`);
    },
};
