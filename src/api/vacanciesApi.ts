import axiosClient from "./axiosClient";
import { mapApiVacancies, type IApiVacancy, type Vacancy } from "@/models/IVacancy";

interface ApiResponse<T> {
    message: string;
    data: T;
    total: number;
}

export const vacanciesApi = {
    /** 🟢 Obtener vacantes aprobadas */
    async getApproved(): Promise<Vacancy[]> {
        const { data } = await axiosClient.get<ApiResponse<IApiVacancy[]>>(
            "/vacantes/aprobadas"
        );
        const mapped = mapApiVacancies(data.data);
        return mapped;
    },

    /** 🟡 Obtener vacantes pendientes */
    async getPending(): Promise<Vacancy[]> {
        const { data } = await axiosClient.get<ApiResponse<IApiVacancy[]>>(
            "/vacantes/pendientes"
        );
        const mapped = mapApiVacancies(data.data);
        return mapped;
    },

    /** 🆕 Crear una nueva vacante */
    async create(vacancy: Omit<Vacancy, "id" | "status">): Promise<Vacancy> {
        const { data } = await axiosClient.post<ApiResponse<IApiVacancy>>(
            "/vacantes",
            vacancy
        );

        return mapApiVacancies([data.data])[0];
    },

    /** 🟣 Aprobar vacante pendiente */
    async approve(id: string): Promise<void> {
        await axiosClient.patch(`/vacantes/${id}/aprobar`);
    },

    /** 🔴 Rechazar una vacante */
    async reject(id: string): Promise<void> {
        await axiosClient.delete(`/vacantes/${id}`);
    },

    /** ⚙️ Cambiar estado (Open/Closed) */
    async toggleStatus(id: string): Promise<void> {
        await axiosClient.patch(`/vacantes/${id}/toggle`);
    },
};
