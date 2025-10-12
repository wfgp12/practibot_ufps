import type { IApiUser } from "./IUser";

export interface Solicitud {
  id: number;
  empresa: string;
  estado: "Pendiente" | "Aprobada" | "Rechazada";
}

/** 💠 Respuesta directa del backend */
export interface IApiCompany {
  id: string;
  nit: string;
  telefono?: string;
  direccion?: string;
  sector?: string;
  descripcion?: string;
  usuario: Partial<IApiUser>;
}

/** 💠 Modelo interno del front */
export interface ICompany {
  id: string;
  nombre: string;
  correo: string;
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
  nit: apiCompany.nit || "",
  telefono: apiCompany.telefono || "",
  direccion: apiCompany.direccion || "",
  sector: apiCompany.sector || "",
  descripcion: apiCompany.descripcion || "",
});