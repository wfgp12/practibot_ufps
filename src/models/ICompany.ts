import type { IApiUser } from "./IUser";

/** 💠 Respuesta directa del backend */
export interface IApiCompany {
  id: string;
  nit: string;
  telefono?: string;
  estado?: string;
  direccion?: string;
  sector?: string;
  descripcion?: string;
  usuario: Partial<IApiUser>;
}

export interface IRegisterCompanyData {
  nombre: string;
  email: string;
  nit: string;
  telefono?: string;
  direccion?: string;
  sector?: string;
  descripcion?: string;
}

/** 💠 Modelo interno del front */
export interface ICompany {
  id: string;
  nombre: string;
  correo: string;
  userId: string;
  estado: string;
  nit: string;
  telefono: string;
  direccion: string;
  sector: string;
  descripcion: string;
}

/** 🧠 Mapper para transformar respuesta del backend */
export const mapCompanyFromApi = (apiCompany: IApiCompany): ICompany => ({
  id: apiCompany.id,
  nombre: apiCompany.usuario?.nombre || "",
  correo: apiCompany.usuario?.email || "",
  userId: apiCompany.usuario?.id || "",
  nit: apiCompany.nit || "",
  estado: apiCompany.estado || "PENDIENTE",
  telefono: apiCompany.telefono || "",
  direccion: apiCompany.direccion || "",
  sector: apiCompany.sector || "",
  descripcion: apiCompany.descripcion || "",
});