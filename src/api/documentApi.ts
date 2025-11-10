import axiosClient from "./axiosClient";
import type { Document, DocumentApi } from "@/models/IDocument";
import { mapDocumentFromApi } from "@/models/IDocument";

export const documentApi = {
  uploadDocument: async (formData: FormData): Promise<Document> => {
    const { data } = await axiosClient.post<{ documento: DocumentApi }>(
      "/documentos/subir",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return mapDocumentFromApi(data.documento);
  },
  listDocuments: async (filters?: {
    category?: string;
    title?: string;
    directorId?: number;
    agreementId?: number;
  }): Promise<Document[]> => {
    const params = new URLSearchParams();
    if (filters?.category) params.append("categoria", filters.category);
    if (filters?.title) params.append("titulo", filters.title);
    if (filters?.directorId) params.append("directorId", String(filters.directorId));
    if (filters?.agreementId) params.append("convenioId", String(filters.agreementId));

    const { data } = await axiosClient.get<DocumentApi[]>(
      `/documentos${params.toString() ? `?${params.toString()}` : ""}`
    );
    return data.map(mapDocumentFromApi);
  },
  getDocumentById: async (id: number): Promise<Document> => {
    const { data } = await axiosClient.get<DocumentApi>(`/documentos/${id}`);
    return mapDocumentFromApi(data);
  },
  updateDocument: async (id: number, formData: FormData): Promise<Document> => {
    const { data } = await axiosClient.put<{ documento: DocumentApi }>(
      `/documentos/${id}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return mapDocumentFromApi(data.documento);
  },
  deleteDocument: async (id: number): Promise<void> => {
    await axiosClient.delete(`/documentos/${id}`);
  },
};
