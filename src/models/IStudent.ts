// src/types/IStudent.ts

/** Interfaz para la API */
export interface IApiPostulacion {
  id: number;
  vacanteId: number;
  estado: string; // EN_REVISION, ACEPTADA, RECHAZADA, CANCELADA
  fechaPostula: string;
  comentario?: string;
}

export interface IApiPractica {
  id: number;
  vacanteId: number;
  estado: string; // EN_PROCESO, FINALIZADA, CANCELADA
  inicio?: string;
  fin?: string;
  evaluacion?: {
    id: number;
    empresaId: number;
    calificacion: number;
    observacion?: string;
    fecha: string;
  };
}

/** Interfaz que refleja la estructura del estudiante según la API */
export interface IApiStudent {
  id: number;
  usuarioId: number;
  documento: string | null;
  codigo: string | null;
  perfil?: string | null;
  empresaId?: number | null;
  empresaAsignada?: string | null;
  estadoProceso?: string | null;
  activo: boolean;
  experiencia?: string | null;
  habilidadesTecnicas?: string[];
  habilidadesBlandas?: string[];
  telefono?: string | null;
  programaAcademico?: string | null;
  semestre?: number | null;
  area?: string | null;
  perfilCompleto: boolean;
  hojaVidaArchivoUrl?: string | null;
  createdAt: string;
  updatedAt: string;

  usuario: {
    id: number;
    nombre: string;
    email: string;
    password?: string | null;
    rol: string;
    creadoEn: string;
    actualizadoEn: string;
  };

  postulaciones: IApiPostulacion[];
  practicas: IApiPractica[];
}

/** Interfaz plana para el frontend */
export interface IStudent {
  id: number;
  name: string;
  code: string | null;
  document: string | null;
  phone: string | null;
  email: string;
  perfilProfesional?: string | null;
  profileComplete: boolean;
  active: boolean;
  area?: string | null;
  technicalSkills?: string[];
  softSkills?: string[];
  experience?: string | null;
  applications: IApiPostulacion[];
  internships: IApiPractica[];
  createdAt: string;
}

/** Mapper: convierte IApiStudent a IStudent */
export const mapApiStudentToStudent = (api: IApiStudent): IStudent => {
  return {
    id: api.id,
    name: api.usuario.nombre,
    code: api.codigo,
    document: api.documento,
    phone: api.telefono ?? null,
    email: api.usuario.email,
    perfilProfesional: api.perfil ?? null,
    profileComplete: api.perfilCompleto,
    active: api.activo,
    area: api.area,
    technicalSkills: api.habilidadesTecnicas || [],
    softSkills: api.habilidadesBlandas || [],
    experience: api.experiencia || null,
    applications: api.postulaciones ?? [],
    internships: api.practicas ?? [],
    createdAt: api.createdAt,
  };
};

/** Mapper inverso: convierte IStudent (frontend) a formato esperado por la API */
export const mapStudentToApiPayload = (student: Partial<IStudent>) => {
  return {
    documento: student.document,
    codigo: student.code,
    telefono: student.phone,
    area: student.area,
    habilidadesTecnicas: student.technicalSkills,
    habilidadesBlandas: student.softSkills,
    experiencia: student.experience,
    perfil: student.profileComplete,
    perfilCompleto: student.profileComplete,
    activo: student.active,
    usuario: {
      update: {
        nombre: student.name,
        email: student.email,
      },
    },
  };
};