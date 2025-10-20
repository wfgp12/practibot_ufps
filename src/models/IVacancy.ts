import type { IApiCompany } from "./ICompany"

export interface Vacancy {
  id: string
  title: string
  area: string
  modality: string
  company: string
  location: string
  workday: string
  skills: string[]
  description?: string
  status: "Open" | "Closed" | "Pending" | "Rejected";
}

export interface IApiVacancy {
  id: number;
  titulo: string;
  area: string;
  descripcion: string;
  requisitos: string;
  estado: "PENDIENTE" | "APROBADA" | "INACTIVA" | "RECHAZADA";
  empresa: IApiCompany;
  empresaId: number;
  directorValidaId: number;
  creadaEn: string;
}

export interface IFormCreateVacancy {
  titulo: string;
  modalidad: string;
  area: string;
  tipoJornada: string;
  descripcion: string;
  requisitos: string;
}

export interface IFormRegisterVacancy extends IFormCreateVacancy {
  empresaId: number;
}

// ✅ API → FRONT
export const mapApiVacancyToVacancy = (
  apiVacancy: Partial<IApiVacancy>
): Vacancy => ({
  id: apiVacancy.id?.toString() ?? crypto.randomUUID(),
  title: apiVacancy.titulo ?? "Sin título",
  area: apiVacancy.area ?? "No especificado",
  modality: apiVacancy.area ?? "No especificado",
  company: apiVacancy.empresa?.usuario?.nombre ?? "Sin empresa",
  location: "Colombia",
  workday: "Práctica",
  skills: apiVacancy.requisitos
    ? apiVacancy.requisitos.split(",").map((s) => s.trim())
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
  area: form.area, // 🔁 "modalidad" del form → "area" del back
  requisitos: form.requisitos,
});

// ✅ FRONT FORM → API BODY (director/admin registra vacante aprobada)
export const mapFormToApiRegisterVacancy = (form: Partial<IFormRegisterVacancy>) => ({
  titulo: form?.titulo ?? "",
  descripcion: form?.descripcion ?? "",
  area: form?.area ?? "",
  requisitos: form?.requisitos ?? "",
  empresaId: form?.empresaId ?? 0,
});

export type VacancyFilters = Partial<
  Pick<
    Vacancy,
    | "title"
    | "company"
    | "modality"
    | "area"
    | "location"
    | "workday"
    | "status"
    | "skills"
  >
>;

/** FRONT → BACK */
export const mapVacancyFiltersToApi = (filters: VacancyFilters = {}) => {
  const mapped: Record<string, string> = {};

  if (filters.title) mapped.titulo = filters.title;
  if (filters.company) mapped.empresa = filters.company;
  if (filters.area) mapped.area = filters.area;
  if (filters.modality) mapped.modalidad = filters.modality;
  if (filters.location) mapped.ubicacion = filters.location;
  if (filters.workday) mapped.tipoJornada = filters.workday;
  if (filters.status)
    mapped.estado = mapFrontStatusToApi(filters.status);
  if (filters.skills?.length)
    mapped.requisitos = filters.skills.join(",");

  return mapped;
};

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

export const mapVacancyToFormRegisterVacancy = (
  vacancy: Vacancy,
  empresaId: number
): IFormRegisterVacancy => ({
  titulo: vacancy.title,
  area: vacancy.area,
  modalidad: vacancy.modality,
  tipoJornada: vacancy.workday,
  descripcion: vacancy.description ?? "",
  requisitos: vacancy.skills.join(","),
  empresaId,
});