import axiosClient from "./axiosClient";
import { mapCompanyFromApi, type IApiCompany, type ICompany } from "@/models/ICompany";

export const companyApi = {
  /** 🟢 Obtener empresa autenticada */
  async getProfile(): Promise<ICompany> {
    const { data } = await axiosClient.get<IApiCompany>("/empresas/profile");
    return mapCompanyFromApi(data);
  },

  /** 🟢 Listar todas las empresas */
  async getAll(): Promise<ICompany[]> {
    const { data } = await axiosClient.get<IApiCompany[]>("/empresas");
    return data.map(mapCompanyFromApi);
  },

  /** 🟢 Listar empresas pendientes */
  async getPending(): Promise<ICompany[]> {
    const { data } = await axiosClient.get<IApiCompany[]>("/empresas/pendientes");
    return data.map(mapCompanyFromApi);
  },

  getById: async (id: string | number): Promise<ICompany> => {
    const { data } = await axiosClient.get(`/empresas/${id}`);
    return mapCompanyFromApi(data);
  },
};
