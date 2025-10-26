import type { IApiCompany } from "./ICompany"

// ╔══════════════════════════════════════════════╗
// ║              MODELOS DEL FRONT               ║
// ╚══════════════════════════════════════════════╝
export interface Vacancy {
  id: string
  title: string
  area: string
  modality: IModality
  company: string
  location: string
  workday: string
  technicalSkills: string[]
  softSkills: string[]
  description?: string
  status: "Open" | "Closed" | "Pending" | "Rejected";
}

// ╔══════════════════════════════════════════════╗
// ║                MODELOS API                   ║
// ╚══════════════════════════════════════════════╝

export type IModality = "PRESENCIAL" | "REMOTO" | "HIBRIDO";
export type IVacancyStatus = "PENDIENTE" | "APROBADA" | "INACTIVA" | "RECHAZADA";
export interface IApiVacancy {
  id: number;
  titulo: string;
  area: string;
  descripcion: string;
  modalidad: IModality;
  habilidadesBlandas?: string;
  habilidadesTecnicas?: string;
  estado: IVacancyStatus;
  empresa: IApiCompany;
  empresaId: number;
  directorValidaId?: number;
  creadaEn: string;
}

export interface IFormCreateVacancy {
  titulo: string;
  modalidad: IModality;
  area?: string;
  descripcion: string;
  habilidadesBlandas?: string;
  habilidadesTecnicas?: string;
}

export interface IFormRegisterVacancy extends IFormCreateVacancy {
  empresaId: number;
}

// ╔══════════════════════════════════════════════╗
// ║         MAPEOS ENTRE FRONT Y API             ║
// ╚══════════════════════════════════════════════╝
// ✅ API → FRONT
export const mapApiVacancyToVacancy = (
  apiVacancy: Partial<IApiVacancy>
): Vacancy => ({
  id: apiVacancy.id?.toString() ?? crypto.randomUUID(),
  title: apiVacancy.titulo ?? "Sin título",
  area: apiVacancy.area ?? "No especificado",
  modality: apiVacancy.modalidad ?? "PRESENCIAL",
  company: apiVacancy.empresa?.usuario?.nombre ?? "Sin empresa",
  location: "Colombia",
  workday: "Práctica",
  technicalSkills: apiVacancy.habilidadesTecnicas
    ? apiVacancy.habilidadesTecnicas.split(",").map((s) => s.trim())
    : [],
  softSkills: apiVacancy.habilidadesBlandas
    ? apiVacancy.habilidadesBlandas.split(",").map((s) => s.trim())
    : [],
  description: apiVacancy.descripcion,
  status: mapApiStatusToFront(apiVacancy.estado),
});

// ✅ Para listas
export const mapApiVacancies = (data: Partial<IApiVacancy>[] = []): Vacancy[] =>
  data.map(mapApiVacancyToVacancy);

// ✅ FRONT FORM → API BODY (empresa crea vacante)
export const mapFormToApiVacancy = (form: IFormCreateVacancy) => ({
  titulo: form.titulo,
  descripcion: form.descripcion,
  area: form.area,
  modalidad: form.modalidad,
  habilidadesBlandas: form.habilidadesBlandas,
  habilidadesTecnicas: form.habilidadesTecnicas,
});

// ✅ FRONT FORM → API BODY (director/admin registra vacante aprobada)
export const mapFormToApiRegisterVacancy = (form: Partial<IFormRegisterVacancy>) => ({
  titulo: form?.titulo ?? "",
  descripcion: form?.descripcion ?? "",
  area: form?.area ?? "",
  modalidad: form?.modalidad ?? "",
  habilidadesBlandas: form?.habilidadesBlandas ?? "",
  habilidadesTecnicas: form?.habilidadesTecnicas ?? "",
  empresaId: form?.empresaId ?? 0,
});

export type VacancyFilters = Partial<
  Pick<Vacancy,
    | "title"
    | "company"
    | "modality"
    | "area"
    | "location"
    | "workday"
    | "status"
  >
> & {
  technicalSkills?: string;
  softSkills?: string;
};

/** FRONT → BACK (filtros de búsqueda) */
export const mapVacancyFiltersToApi = (filters: VacancyFilters = {}) => {
  const mapped: Record<string, string> = {};

  if (filters.title) mapped.titulo = filters.title;
  if (filters.technicalSkills) mapped.habilidadesTecnicas = filters.technicalSkills;
  if (filters.softSkills) mapped.habilidadesBlandas = filters.softSkills;
  if (filters.company) mapped.empresa = filters.company;
  if (filters.area) mapped.area = filters.area;
  if (filters.modality) mapped.modalidad = filters.modality;
  if (filters.location) mapped.ubicacion = filters.location;
  if (filters.workday) mapped.tipoJornada = filters.workday;
  if (filters.status)
    mapped.estado = mapFrontStatusToApi(filters.status);

  return mapped;
};

// ╔══════════════════════════════════════════════╗
// ║              ESTADOS VACANTES                ║
// ╚══════════════════════════════════════════════╝

export const mapFrontStatusToApi = (status: Vacancy["status"]): IApiVacancy["estado"] => {
  switch (status) {
    case "Open":
      return "APROBADA";
    case "Closed":
      return "INACTIVA";
    case "Pending":
      return "PENDIENTE";
    case "Rejected":
      return "RECHAZADA";
    default:
      return "APROBADA";
  }
};

export const mapApiStatusToFront = (estado?: IApiVacancy["estado"]): Vacancy["status"] => {
  switch (estado) {
    case "APROBADA":
      return "Open";
    case "INACTIVA":
      return "Closed";
    case "PENDIENTE":
      return "Pending";
    case "RECHAZADA":
      return "Rejected";
    default:
      return "Open";
  }
};

// ✅ FRONT → FORM (editar vacante o registrar)
export const mapVacancyToFormRegisterVacancy = (
  vacancy: Vacancy,
  empresaId: number
): IFormRegisterVacancy => ({
  titulo: vacancy.title,
  area: vacancy.area,
  modalidad: vacancy.modality,
  descripcion: vacancy.description ?? "",
  habilidadesBlandas: vacancy.softSkills.join(","),
  habilidadesTecnicas: vacancy.technicalSkills.join(","),
  empresaId,
});