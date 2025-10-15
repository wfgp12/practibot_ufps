import axiosClient from "./axiosClient";
import { mapCompanyFromApi, type IApiCompany, type ICompany, type IRegisterCompanyData } from "@/models/ICompany";

interface ApiResponse<T> {
  data: T;
  message: string;
}
export const companyApi = {

  register: async (data: IRegisterCompanyData): Promise<ICompany> => {
    const { data: res } = await axiosClient.post<IApiCompany>("/empresas/registro", data);
    return mapCompanyFromApi(res);
  },
 
  update: async (id: string, data: IRegisterCompanyData): Promise<ICompany> => {
    const { data: res } = await axiosClient.put<ApiResponse<IApiCompany>>(`/empresas/${id}/editar`, data);
    console.log(res)
    return mapCompanyFromApi(res.data);
  },

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

  /** ✅ Aprobar empresa pendiente */
  approve: async (id: string | number): Promise<ICompany> => {
    const { data } = await axiosClient.patch(`/empresas/${id}/aprobar`);
    return mapCompanyFromApi(data.data);
  },

  /** ❌ Rechazar empresa pendiente */
  reject: async (id: string | number): Promise<ICompany> => {
    const { data } = await axiosClient.patch(`/empresas/${id}/rechazar`);
    return mapCompanyFromApi(data.data);
  },

  /** 🔄 Cambiar estado de empresa aprobada entre APROBADA e INACTIVA */
  toggleState: async (id: string | number, estado: "APROBADA" | "INACTIVA"): Promise<ICompany> => {
    const { data } = await axiosClient.patch(`/empresas/${id}/estado`, { estado });
    return mapCompanyFromApi(data.data);
  },
};
