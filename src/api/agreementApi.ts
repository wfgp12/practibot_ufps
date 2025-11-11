import { mapAgreementFromApi, type Agreement, type AgreementApi } from "@/models/IAgreement";
import axiosClient from "./axiosClient";


export const agreementApi = {
    createAgreement: async (): Promise<Agreement> => {
        const { data } = await axiosClient.post<{ data: AgreementApi }>("/convenios/iniciar");
        return mapAgreementFromApi(data.data);
    },
    listMyAgreements: async (): Promise<Agreement[]> => {
        const { data } = await axiosClient.get<{ data: AgreementApi[] }>("/convenios/me");
        return data.data.map(mapAgreementFromApi);
    },
    listAllAgreements: async (): Promise<Agreement[]> => {
        const { data } = await axiosClient.get<{ convenios: AgreementApi[] }>("/convenios");
        return data.convenios.map(mapAgreementFromApi);
    },
    listAgreementsByCompanyId: async (empresaId: number): Promise<Agreement[]> => {
        const { data } = await axiosClient.get<{ data: AgreementApi[] }>(`/convenios/empresa/${empresaId}`);
        return data.data.map(mapAgreementFromApi);
    },
    getAgreementById: async (id: number): Promise<Agreement> => {
        const { data } = await axiosClient.get<{ data: AgreementApi }>(`/convenios/${id}`);
        return mapAgreementFromApi(data.data);
    },
    uploadSignedAgreement: async (id: number, file: File): Promise<Agreement> => {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await axiosClient.post<{ data: AgreementApi }>(
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
}