
import { mapApiStudentToStudent, type IApiStudent } from "./IStudent";
import { mapApiVacancyToVacancy, type IApiVacancy } from "./IVacancy";

/** ======== BACKEND MODELS (API) ======== */
export interface IApiPostulation {
    id: number;
    estudianteId: number;
    vacanteId: number;
    estado: "EN_REVISION" | "ACEPTADA" | "RECHAZADA" | "CANCELADA";
    fechaPostula: string; // ISO string
    comentario?: string;
    estudiante?: IApiStudent; // opcional si viene expandido
    vacante?: IApiVacancy;
}

export interface IApiPostulationsResponse {
    totalRecibidos: number;
    creados: number[];
    yaPostulados: number[];
    detalle: IApiPostulation[];
}

/** ======== FRONTEND MODELS ======== */
export interface IPostulation {
    id: number;
    studentId: number;
    vacancyId: number;
    status: "IN_REVIEW" | "ACCEPTED" | "REJECTED" | "CANCELLED";
    createdAt: Date;
    comment?: string;
    student?: ReturnType<typeof mapApiStudentToStudent>;
    vacancy?: ReturnType<typeof mapApiVacancyToVacancy>;
}

export interface IPostulationsResponse {
    totalReceived: number;
    created: number[];
    alreadyApplied: number[];
    detail: IPostulation[];
}

/** ======== REQUEST DTOs ======== */
export interface CreatePostulationDto {
    vacanteId: number;
    comentario?: string;
}

export interface UpdatePostulationStatusDto {
    estado: "EN_REVISION" | "ACEPTADA" | "RECHAZADA" | "CANCELADA";
}

/** ======== MAPPERS ======== */

/** Convierte una postulación del API a modelo interno del front */
export const mapPostulationFromApi = (api: IApiPostulation): IPostulation => ({
    id: api.id,
    studentId: api.estudianteId,
    vacancyId: api.vacanteId,
    status: convertirEstadoApiAFront(api.estado),
    createdAt: new Date(api.fechaPostula),
    comment: api.comentario,
    student: api.estudiante ? mapApiStudentToStudent(api.estudiante) : undefined,
    vacancy: api.vacante ? mapApiVacancyToVacancy(api.vacante) : undefined,
});

export const mapPostulationsResponse = (
    api: IApiPostulationsResponse
): IPostulationsResponse => ({
    totalReceived: api.totalRecibidos,
    created: api.creados,
    alreadyApplied: api.yaPostulados,
    detail: api.detalle.map(mapPostulationFromApi),
});

/** Convierte una postulación del front al formato esperado por el API */
export const mapPostulationToApi = (front: IPostulation): IApiPostulation => ({
    id: front.id,
    estudianteId: front.studentId,
    vacanteId: front.vacancyId,
    estado: convertirEstadoFrontAApi(front.status),
    fechaPostula: front.createdAt.toISOString(),
    comentario: front.comment,
});

/** ======== HELPERS ======== */
const convertirEstadoApiAFront = (
    estado: IApiPostulation["estado"]
): IPostulation["status"] => {
    switch (estado) {
        case "EN_REVISION":
            return "IN_REVIEW";
        case "ACEPTADA":
            return "ACCEPTED";
        case "RECHAZADA":
            return "REJECTED";
        case "CANCELADA":
            return "CANCELLED";
    }
};

const convertirEstadoFrontAApi = (
    estado: IPostulation["status"]
): IApiPostulation["estado"] => {
    switch (estado) {
        case "IN_REVIEW":
            return "EN_REVISION";
        case "ACCEPTED":
            return "ACEPTADA";
        case "REJECTED":
            return "RECHAZADA";
        case "CANCELLED":
            return "CANCELADA";
    }
};
