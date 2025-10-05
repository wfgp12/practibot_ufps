export interface ICurriculum {
  summary?: string; // resumen breve o descripción personal
  experiences?: IExperience[]; // trabajos, proyectos o prácticas
  education?: IEducation[]; // estudios realizados
  skills?: string[]; // habilidades o tecnologías
  projects?: IProject[]; // proyectos personales o académicos
  certifications?: ICertification[]; // cursos o certificaciones relevantes
  languages?: string[]; // idiomas hablados
  resumeUrl?: string; // enlace a un PDF o documento
}

export interface IExperience {
  company: string;
  role: string;
  description?: string;
  startDate: string;
  endDate?: string;
}

export interface IEducation {
  institution: string;
  degree: string;
  startDate: string;
  endDate?: string;
}

export interface IProject {
  name: string;
  description?: string;
  technologies?: string[];
  link?: string;
}

export interface ICertification {
  title: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
}
