import type { IApiCompany } from "./ICompany"

export interface Vacancy {
  id: string
  title: string
  modality: string
  company: string
  location: string
  workday: string
  skills: string[]
  description?: string
  status: "Open" | "Closed" | "Pending"
}

export interface IApiVacancy {
  id: number;
  titulo: string;
  area: string;
  descripcion: string;
  requisitos: string;
  estado: string;
  empresa: IApiCompany;
  empresaId: number;
  directorValidaId: number;
  creadaEn: string;
}

export interface IFormCreateVacancy {
  titulo: string;
  modalidad: string;
  tipoJornada: string;
  descripcion: string;
  requisitos: string;
}



// ✅ Mapper que transforma los datos del backend al formato del frontend
export const mapApiVacancyToVacancy = (apiVacancy: Partial<IApiVacancy>): Vacancy => ({
  id: apiVacancy.id?.toString() ?? crypto.randomUUID(),
  title: apiVacancy.titulo ?? "Sin título",
  modality: apiVacancy.area ?? "No especificado",
  company: apiVacancy.empresa?.usuario?.nombre ?? "Sin empresa",
  location: "Colombia",
  workday: "Práctica",
  skills: apiVacancy.requisitos
    ? apiVacancy.requisitos.split(",").map((s) => s.trim())
    : [],
  description: apiVacancy.descripcion,
  status: apiVacancy.estado === "APROBADA" ? "Open" : "Pending",
});

// ✅ Mapper para listas
export const mapApiVacancies = (data: Partial<IApiVacancy>[] = []): Vacancy[] =>
  data.map(mapApiVacancyToVacancy);

export const mapFormToApiVacancy = (
  form: IFormCreateVacancy
) => ({
  titulo: form.titulo,
  descripcion: form.descripcion,
  area: form.modalidad, // 🔁 "modalidad" del form → "area" del back
  requisitos: form.requisitos,
});