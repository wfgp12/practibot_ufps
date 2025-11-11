import { mapCompanyFromApi, type IApiCompany, type ICompany } from "./ICompany";

export const AGREEMENT_TYPES = ["MARCO", "ESPECIFICO"] as const;
export const AGREEMENT_STATUSES = [
  "PENDIENTE_FIRMA",
  "PENDIENTE_REVISION",
  "EN_REVISION",
  "APROBADO",
  "RECHAZADO",
  "VENCIDO",
] as const;

export type AgreementApiType = (typeof AGREEMENT_TYPES)[number];
export type AgreementApiStatus = (typeof AGREEMENT_STATUSES)[number];

export interface AgreementApi {
  id: number;
  empresaId: number;
  directorId: number;
  nombre: string;
  descripcion?: string;
  tipo: AgreementApiType;
  fechaInicio?: string;
  fechaFin?: string;
  estado: AgreementApiStatus;
  archivoUrl?: string;
  observaciones?: string;
  version: number;
  creadoEn: string;
  actualizadoEn: string;
  empresa?: IApiCompany | null;
}

export interface Agreement {
  id: number;
  companyId: number;
  directorId: number;
  name: string;
  description?: string;
  type: "Marco" | "Específico";
  startDate?: Date | null;
  endDate?: Date | null;
  status:
    | "Pendiente de firma"
    | "Pendiente de revisión"
    | "En revisión"
    | "Aprobado"
    | "Rechazado"
    | "Vencido";
  fileUrl?: string;
  notes?: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  company?: ICompany | null;
}

const STATUS_MAP = {
  PENDIENTE_FIRMA: "Pendiente de firma",
  PENDIENTE_REVISION: "Pendiente de revisión",
  EN_REVISION: "En revisión",
  APROBADO: "Aprobado",
  RECHAZADO: "Rechazado",
  VENCIDO: "Vencido",
} as const;

const REVERSE_STATUS_MAP = Object.fromEntries(
  Object.entries(STATUS_MAP).map(([key, value]) => [value, key])
) as Record<Agreement["status"], AgreementApiStatus>;


export const mapAgreementFromApi = (api: AgreementApi): Agreement => ({
  id: api.id,
  companyId: api.empresaId,
  directorId: api.directorId,
  name: api.nombre,
  description: api.descripcion || undefined,
  type: api.tipo === "MARCO" ? "Marco" : "Específico",
  startDate: api.fechaInicio ? new Date(api.fechaInicio) : null,
  endDate: api.fechaFin ? new Date(api.fechaFin) : null,
  status: STATUS_MAP[api.estado] ?? "En revisión",
  fileUrl: api.archivoUrl || undefined,
  notes: api.observaciones || undefined,
  version: api.version,
  createdAt: new Date(api.creadoEn),
  updatedAt: new Date(api.actualizadoEn),
  company: api.empresa ? mapCompanyFromApi(api.empresa) : undefined,
});

export const mapAgreementToApi = (agreement: Agreement): AgreementApi => ({
  id: agreement.id,
  empresaId: agreement.companyId,
  directorId: agreement.directorId,
  nombre: agreement.name,
  descripcion: agreement.description,
  tipo: agreement.type === "Marco" ? "MARCO" : "ESPECIFICO",
  fechaInicio: agreement.startDate?.toISOString(),
  fechaFin: agreement.endDate?.toISOString(),
  estado: REVERSE_STATUS_MAP[agreement.status] ?? "EN_REVISION",
  archivoUrl: agreement.fileUrl,
  observaciones: agreement.notes,
  version: agreement.version,
  creadoEn: agreement.createdAt.toISOString(),
  actualizadoEn: agreement.updatedAt.toISOString(),
});