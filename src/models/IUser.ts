export type Role = "guest" | "DIRECTOR" | "EMPRESA" | "ESTUDIANTE" | "ADMIN";

export interface IUser {
  id: number;
  name: string;
  email: string;
  role: Role;
}

// Interfaz opcional de cómo viene del backend
export interface IApiUser {
  id: number;
  nombre?: string;   
  email: string;
  rol?: string;   
}

// Mapper para transformar el usuario de backend a frontend
export const mapUser = (backendUser: IApiUser): IUser => {
  return {
    id: backendUser.id,
    name: backendUser.nombre || "Sin nombre",
    email: backendUser.email,
    role: mapRole(backendUser.rol),
  };
};

// Mapeo seguro de roles
const mapRole = (role?: string): Role => {
  switch (role?.toUpperCase()) {
    case "DIRECTOR":
      return "DIRECTOR";
    case "EMPRESA":
      return "EMPRESA";
    case "ESTUDIANTE":
      return "ESTUDIANTE";
    case "ADMIN":
      return "ADMIN";
    default:
      return "guest";
  }
};
