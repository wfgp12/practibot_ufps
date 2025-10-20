import type { IApiPaginatedResponse, IApiResponse } from "@/models/IApi";
import axiosClient from "./axiosClient";
import { mapCompanyFromApi, type CompanyOption, type IApiCompany, type ICompany, type IRegisterCompanyData } from "@/models/ICompany";


interface PaginationParams {
  page?: number;
  pageSize?: number;
  estado?: string;
  nombre?: string;
  correo?: string;
  nit?: string;
  sector?: string;
}

export const companyApi = {

  create: async (data: IRegisterCompanyData): Promise<ICompany> => {
    const { data: res } = await axiosClient.post<IApiCompany>("/empresas/create", data);
    return mapCompanyFromApi(res);
  },

  register: async (data: IRegisterCompanyData): Promise<ICompany> => {
    const { data: res } = await axiosClient.post<IApiCompany>("/empresas/registro", data);
    return mapCompanyFromApi(res);
  },
 
  update: async (id: string, data: IRegisterCompanyData): Promise<ICompany> => {
    const { data: res } = await axiosClient.put<IApiResponse<IApiCompany>>(`/empresas/${id}/editar`, data);
    return mapCompanyFromApi(res.data);
  },

  /** 🟢 Obtener empresa autenticada */
  getProfile: async (): Promise<ICompany> => {
    const { data } = await axiosClient.get<IApiCompany>("/empresas/profile");
    return mapCompanyFromApi(data);
  },

  /** 🟢 Listar todas las empresas */
  getAll: async (params?: PaginationParams): Promise<IApiPaginatedResponse<ICompany>> => {
    const { data } = await axiosClient.get<IApiPaginatedResponse<IApiCompany>>("/empresas", {params});
    return {
      data: data.data.map(mapCompanyFromApi),
      total: data.total,
      page: data.page,
      pageSize: data.pageSize,
    };
  },

  /** 🟢 Listar empresas pendientes */
  getPending: async (params?: PaginationParams): Promise<IApiPaginatedResponse<ICompany>> => {
    const { data } = await axiosClient.get<IApiPaginatedResponse<IApiCompany>>("/empresas/pendientes", { params });
    return {
      data: data.data.map(mapCompanyFromApi),
      total: data.total,
      page: data.page,
      pageSize: data.pageSize,
    };
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

  async listCompanies(): Promise<CompanyOption[]> {
  const { data } = await axiosClient.get<IApiResponse<CompanyOption[]>>(
    "/empresas/listar"
  );
  return data.data;
}
};
