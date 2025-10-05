import { useState } from "react";

export interface IDocument {
  id: string;
  title: string;
  category: string;
  description: string;
  fileUrl?: string; // futura URL del documento (Cloudinary, S3)
  fileName: string;
  uploadedAt: string;
}

export const useDocuments = () => {
  const [documents, setDocuments] = useState<IDocument[]>([]);

  const addDocument = (doc: Omit<IDocument, "id" | "uploadedAt">) => {
    const newDoc: IDocument = {
      id: crypto.randomUUID(),
      uploadedAt: new Date().toISOString(),
      ...doc,
    };
    setDocuments((prev) => [...prev, newDoc]);
  };

  const removeDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  return { documents, addDocument, removeDocument };
};
