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
    }
}