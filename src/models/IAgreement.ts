import { mapCompanyFromApi, type IApiCompany, type ICompany } from "./ICompany";

export const AGREEMENT_TYPES = ["MACRO", "ESPECIFICO"] as const;
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

export interface IMassiveCreatedAgreement {
  id: number;
  nombre: string;
  empresaId: number;
}

export interface IMassiveFailedAgreement {
  nombre: string;
  reason: string;
  row: number; 
}

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
  type: "Macro" | "Específico";
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
  type: api.tipo === "MACRO" ? "Macro" : "Específico",
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
  tipo: agreement.type === "Macro" ? "MACRO" : "ESPECIFICO",
  fechaInicio: agreement.startDate?.toISOString(),
  fechaFin: agreement.endDate?.toISOString(),
  estado: REVERSE_STATUS_MAP[agreement.status] ?? "EN_REVISION",
  archivoUrl: agreement.fileUrl,
  observaciones: agreement.notes,
  version: agreement.version,
  creadoEn: agreement.createdAt.toISOString(),
  actualizadoEn: agreement.updatedAt.toISOString(),
});

const FILTER_KEY_MAP = {
  name: "nombre",
  status: "estado",
  type: "tipo",
  startDate: "fechaInicio",
  endDate: "fechaFin",
  company: "empresa",
} as const;

const FILTER_VALUE_MAPS = {
  status: REVERSE_STATUS_MAP,
  type: {
    Macro: "MACRO",
    Específico: "ESPECIFICO",
  } as const,
} as const;

type FrontFilterKey = keyof typeof FILTER_KEY_MAP;
type ApiFilterKey = (typeof FILTER_KEY_MAP)[FrontFilterKey];
type FilterValueMapKey = keyof typeof FILTER_VALUE_MAPS;

/**
 * Transforma los filtros del front al formato que espera el backend
 */
export const mapAgreementFiltersToApi = (
  filters: Partial<Record<FrontFilterKey, string>>
): Partial<Record<ApiFilterKey, string>> => {
  const mapped: Partial<Record<ApiFilterKey, string>> = {};

  for (const [key, rawValue] of Object.entries(filters) as [FrontFilterKey, string][]) {
    if (!rawValue || rawValue === "All" || rawValue === "Todos") continue;

    const apiKey = FILTER_KEY_MAP[key];
    const valueMap = FILTER_VALUE_MAPS[key as FilterValueMapKey];

    let finalValue = rawValue;

    const isDateFormat = /^\d{4}-\d{2}-\d{2}$/.test(rawValue);

    if (isDateFormat) {
      finalValue = new Date(`${rawValue}T00:00:00`).toISOString(); 
    }

    mapped[apiKey] =
      valueMap && rawValue in valueMap
        ? valueMap[rawValue as keyof typeof valueMap]
        : finalValue;
  }

  return mapped;
};