import type { IApiUser } from "./IUser";

export interface Solicitud {
  id: number;
  empresa: string;
  estado: "Pendiente" | "Aprobada" | "Rechazada";
}

export interface Convenio {
  id: number;
  empresa: string;
  nit: string;
}

export interface IApiCompany {
    id: number;
    usuario: Partial<IApiUser>;
  };