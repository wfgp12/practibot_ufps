import { useState, useEffect, useCallback } from "react";
import { documentApi } from "@/api/documentApi";
import type { Document } from "@/models/IDocument";

interface DocumentFilters {
  category?: string;
  directorId?: number;
  agreementId?: number;
  title?: string;
}

export const useDocuments = (initialFilters?: DocumentFilters) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = (err: unknown): string => {
    if (err instanceof Error) return err.message;
    if (typeof err === "string") return err;
    return "Error desconocido al procesar la solicitud";
  };

  const fetchDocuments = useCallback(
    async (filters: DocumentFilters = initialFilters || {}) => {
      setLoading(true);
      setError(null);
      try {
        const data = await documentApi.listDocuments(filters);
        setDocuments(data);
      } catch (err: unknown) {
        const message = handleError(err);
        console.error("Error fetching documents:", message);
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [initialFilters]
  );

  const uploadDocument = useCallback(async (formData: FormData) => {
    try {
      const newDoc = await documentApi.uploadDocument(formData);
      setDocuments((prev) => [newDoc, ...prev]);
      return newDoc;
    } catch (err: unknown) {
      throw new Error(handleError(err));
    }
  }, []);

  const updateDocument = useCallback(async (id: number, formData: FormData) => {
    try {
      const updated = await documentApi.updateDocument(id, formData);
      setDocuments((prev) => prev.map((d) => (d.id === id ? updated : d)));
      return updated;
    } catch (err: unknown) {
      throw new Error(handleError(err));
    }
  }, []);

  const deleteDocument = useCallback(async (id: number) => {
    try {
      await documentApi.deleteDocument(id);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
    } catch (err: unknown) {
      throw new Error(handleError(err));
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return {
    documents,
    loading,
    error,
    fetchDocuments,
    uploadDocument,
    updateDocument,
    deleteDocument,
  };
};
