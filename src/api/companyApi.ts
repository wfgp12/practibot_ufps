import axiosClient from "./axiosClient";
import { mapCompanyFromApi, type IApiCompany, type ICompany } from "@/models/ICompany";

export const companyApi = {
  /** 🟢 Obtener empresa autenticada */
  async getProfile(): Promise<ICompany> {
    const { data } = await axiosClient.get<IApiCompany>("/empresas/profile");
    return mapCompanyFromApi(data);
  },
};
