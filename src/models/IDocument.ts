export interface Document {
  id: number;
  title: string;
  description?: string;
  category: "GENERAL" | "CONVENIO" | "ESTUDIANTE" | "EMPRESA";
  fileUrl: string;
  createdAt: Date;
  updatedAt: Date;
  directorId: number;
  agreementId?: number;
}

export interface DocumentApi {
  id: number;
  titulo: string;
  descripcion?: string;
  categoria: "GENERAL" | "CONVENIO" | "ESTUDIANTE" | "EMPRESA";
  archivoUrl: string;
  createdAt: string;
  updatedAt: string;
  directorId: number;
  convenioId?: number;
}

export const mapDocumentFromApi = (data: DocumentApi): Document => ({
  id: data.id,
  title: data.titulo,
  description: data.descripcion,
  category: data.categoria,
  fileUrl: data.archivoUrl,
  createdAt: new Date(data.createdAt),
  updatedAt: new Date(data.updatedAt),
  directorId: data.directorId,
  agreementId: data.convenioId,
});
