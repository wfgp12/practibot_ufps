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
  codigo: string;
  cedula: string;
  telefono: string;
  perfilCompleto: boolean;
  activo: boolean;
  descripcion?: string;
  area?: string;
  habilidadesTecnicas?: string[];
  habilidadesBlandas?: string[];
  experiencia?: string;
  usuario: {
    id: number;
    nombre: string;
    email: string;
    rol: string;
    creadoEn: string;
    actualizadoEn: string;
  };
  postulaciones?: IApiPostulacion[];
  practicas?: IApiPractica[];
}

/** Interfaz plana para el frontend */
export interface IStudent {
  id: number;
  name: string;
  code: string;
  document: string;
  phone: string;
  email: string;
  profileComplete: boolean;
  active: boolean;
  description?: string;
  area?: string;
  technicalSkills?: string[];
  softSkills?: string[];
  experience?: string;
  applications?: IApiPostulacion[];
  internships?: IApiPractica[];
}

/** Mapper: convierte IApiStudent a IStudent */
export const mapApiStudentToStudent = (apiStudent: IApiStudent): IStudent => {
  return {
    id: apiStudent.id,
    name: apiStudent.usuario.nombre,
    code: apiStudent.codigo,
    document: apiStudent.cedula,
    phone: apiStudent.telefono,
    email: apiStudent.usuario.email,
    profileComplete: apiStudent.perfilCompleto,
    active: apiStudent.activo,
    description: apiStudent.descripcion,
    area: apiStudent.area,
    technicalSkills: apiStudent.habilidadesTecnicas,
    softSkills: apiStudent.habilidadesBlandas,
    experience: apiStudent.experiencia,
    applications: apiStudent.postulaciones || [],
    internships: apiStudent.practicas || [],
  };
};

/** Mapper inverso: convierte IStudent (frontend) a formato esperado por la API */
export const mapStudentToApiPayload = (student: Partial<IStudent>) => {
  return {
    descripcion: student.description,
    area: student.area,
    codigo: student.code,
    cedula: student.document,
    telefono: student.phone,
    habilidadesTecnicas: student.technicalSkills,
    habilidadesBlandas: student.softSkills,
    experiencia: student.experience,
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