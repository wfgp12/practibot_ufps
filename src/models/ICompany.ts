export interface Solicitud {
  id: number;
  empresa: string;
  estado: "Pendiente" | "Aprobada" | "Rechazada";
}

export interface Convenio {
  id: number;
  empresa: string;
  nit: string;
}