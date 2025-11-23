import { mapAgreementFromApi, type Agreement, type AgreementApi, type IMassiveCreatedAgreement, type IMassiveFailedAgreement } from "@/models/IAgreement";
import axiosClient from "./axiosClient";
import type { IApiPaginatedResponse, IApiResponse } from "@/models/IApi";


export const agreementApi = {
  createByDirector: async (payload: {
    empresaId: number;
    nombre: string;
    descripcion?: string;
    tipo: string;
    observaciones?: string;
    file?: File;
    fechaInicio: string;
    fechaFin: string;
    estado: "EN_REVISION" | "APROBADO" | "RECHAZADO";
  }): Promise<Agreement> => {
    const formData = new FormData();
    formData.append("empresaId", payload.empresaId.toString());
    formData.append("nombre", payload.nombre);
    formData.append("tipo", payload.tipo);
    formData.append("fechaInicio", payload.fechaInicio);
    formData.append("fechaFin", payload.fechaFin);
    formData.append("estado", payload.estado);

    if (payload.descripcion) formData.append("descripcion", payload.descripcion);
    if (payload.observaciones) formData.append("observaciones", payload.observaciones);
    if (payload.file) formData.append("file", payload.file);

    const { data } = await axiosClient.post<IApiResponse<AgreementApi>>(
      "/convenios/crear",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return mapAgreementFromApi(data.data);
  },
  uploadMassiveAgreements: async (
    archivoData: File,
    archivos: File[]
  ): Promise<{
    created: IMassiveCreatedAgreement[];
    failed: IMassiveFailedAgreement[];
  }> => {

    const formData = new FormData();
    formData.append("archivoData", archivoData);

    archivos.forEach((file) => {
      formData.append("archivos", file);
    });

    const { data } = await axiosClient.post<
      IApiResponse<{
        created: IMassiveCreatedAgreement[];
        failed: IMassiveFailedAgreement[];
      }>
    >(
      "/convenios/cargar",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return data.data;
  },
  createAgreement: async (): Promise<Agreement> => {
    const { data } = await axiosClient.post<IApiResponse<AgreementApi>>("/convenios/iniciar");
    return mapAgreementFromApi(data.data);
  },
  listMyAgreements: async (
    page = 1,
    pageSize = 10,
    filters: Record<string, unknown> = {}
  ): Promise<IApiPaginatedResponse<Agreement>> => {
    const { data } = await axiosClient.get<IApiPaginatedResponse<AgreementApi>>("/convenios/me", { params: { page, pageSize, ...filters } });
    return {
      ...data,
      data: data.data.map(mapAgreementFromApi),
    };
  },
  listAgreements: async (
    page = 1,
    pageSize = 10,
    filters: Record<string, unknown> = {}
  ): Promise<IApiPaginatedResponse<Agreement>> => {
    const { data } = await axiosClient.get<IApiPaginatedResponse<AgreementApi>>("/convenios", { params: { page, pageSize, ...filters } });
    return {
      ...data,
      data: data.data.map(mapAgreementFromApi),
    };
  },
  listPendingAgreements: async (
    page = 1,
    pageSize = 10,
    filters: Record<string, unknown> = {}
  ): Promise<IApiPaginatedResponse<Agreement>> => {
    const { data } = await axiosClient.get<IApiPaginatedResponse<AgreementApi>>("/convenios/pendientes", { params: { page, pageSize, ...filters } });
    return {
      ...data,
      data: data.data.map(mapAgreementFromApi),
    };
  },
  listAgreementsByCompanyId: async (
    empresaId: number,
    page = 1,
    pageSize = 10,
    filters: Record<string, unknown> = {}
  ): Promise<IApiPaginatedResponse<Agreement>> => {
    const { data } = await axiosClient.get<IApiPaginatedResponse<AgreementApi>>(`/convenios/empresa/${empresaId}`, { params: { page, pageSize, ...filters } });
    return {
      ...data,
      data: data.data.map(mapAgreementFromApi),
    };
  },
  getAgreementById: async (id: number): Promise<Agreement> => {
    const { data } = await axiosClient.get<IApiResponse<AgreementApi>>(`/convenios/${id}`);
    return mapAgreementFromApi(data.data);
  },
  uploadSignedAgreement: async (id: number, file: File): Promise<Agreement> => {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await axiosClient.post<IApiResponse<AgreementApi>>(
      `/convenios/${id}/subir-firmado`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return mapAgreementFromApi(data.data);
  },
  sendForFinalReview: async (id: number): Promise<Agreement> => {
    const { data } = await axiosClient.post<{ data: AgreementApi }>(
      `/convenios/${id}/enviar-revision`
    );
    return mapAgreementFromApi(data.data);
  },
  approveAgreement: async (
    id: number,
    file: File,
    details: { fechaInicio?: string; fechaFin?: string; observaciones?: string }
  ): Promise<Agreement> => {
    const formData = new FormData();
    formData.append("file", file);
    if (details.fechaInicio) formData.append("fechaInicio", details.fechaInicio);
    if (details.fechaFin) formData.append("fechaFin", details.fechaFin);
    if (details.observaciones) formData.append("observaciones", details.observaciones);

    const { data } = await axiosClient.post<{ data: AgreementApi }>(
      `/convenios/${id}/aprobar`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return mapAgreementFromApi(data.data);
  },
  rejectAgreement: async (id: number, observaciones?: string): Promise<Agreement> => {
    const { data } = await axiosClient.post<{ data: AgreementApi }>(
      `/convenios/${id}/rechazar`,
      { observaciones }
    );
    return mapAgreementFromApi(data.data);
  },
  uploadNewVersion: async (id: number, file: File): Promise<Agreement> => {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await axiosClient.post<IApiResponse<AgreementApi>>(
      `/convenios/${id}/nueva-version`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return mapAgreementFromApi(data.data);
  },
}