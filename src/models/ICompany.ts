import type { IApiUser } from "./IUser";

export interface IApiRepresentative {
  id: number;
  nombreCompleto: string;
  tipoDocumento: string;
  numeroDocumento: string;
  // cargo: string;
  telefono?: string;
  email: string;
}

export interface IApiCompany {
  id: number;
  nit: string;
  telefono?: string;
  estado?: string;
  direccion?: string;
  sector?: string;
  descripcion?: string;
  usuario: Partial<IApiUser>;
  representanteLegal?: IApiRepresentative;
  habilitada?: boolean;
}

export interface IRegisterCompanyData {
  nombre: string;
  email: string;
  nit: string;
  telefono?: string;
  direccion?: string;
  sector?: string;
  descripcion?: string;
  representanteLegal?: Omit<IApiRepresentative, "id">;
}

export interface IRepresentative {
  id: number;
  nombre: string;
  tipoDocumento: string;
  numeroDocumento: string;
  // cargo: string;
  telefono: string;
  correo: string;
}
export interface ICompany {
  id: number;
  nombre: string;
  correo: string;
  userId: number;
  estado: string;
  nit: string;
  telefono: string;
  direccion: string;
  sector: string;
  descripcion: string;
  representanteLegal?: IRepresentative;
  isEnabled?: boolean;
}

export interface CompanyOption {
  id: string | number;
  nombre: string;
  email: string;
}
export const mapCompanyFromApi = (api: IApiCompany): ICompany => ({
  id: api.id,
  nombre: api.usuario?.nombre || "",
  correo: api.usuario?.email || "",
  userId: api.usuario?.id || 0,
  nit: api.nit || "",
  estado: api.estado || "PENDIENTE",
  telefono: api.telefono || "",
  direccion: api.direccion || "",
  sector: api.sector || "",
  descripcion: api.descripcion || "",
  isEnabled: api.habilitada || false,

  representanteLegal: api.representanteLegal
    ? {
      id: api.representanteLegal.id,
      nombre: api.representanteLegal.nombreCompleto,
      tipoDocumento: api.representanteLegal.tipoDocumento,
      numeroDocumento: api.representanteLegal.numeroDocumento,
      // cargo: api.representanteLegal.cargo,
      telefono: api.representanteLegal.telefono || "",
      correo: api.representanteLegal.email,
    }
    : undefined,
});

export const mapApiFromCompany = (company: ICompany): IApiCompany => {
  return {
    id: company.id,
    usuario: {
      nombre: company.nombre,
      email: company.correo,
      id: company.userId,
    },
    nit: company.nit,
    estado: company.estado,
    direccion: company.direccion,
    sector: company.sector,
    descripcion: company.descripcion,
    representanteLegal: {
      id: company.representanteLegal?.id || 0,
      nombreCompleto: company.representanteLegal?.nombre || "",
      tipoDocumento: company.representanteLegal?.tipoDocumento || "",
      numeroDocumento: company.representanteLegal?.numeroDocumento || "",
      // cargo: company.representanteLegal?.cargo || "",
      email: company.representanteLegal?.correo || "",
      telefono: company.representanteLegal?.telefono,
    },
  }

}