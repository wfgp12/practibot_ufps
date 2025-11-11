import { useState, useEffect } from "react";
import type { Agreement } from "@/models/IAgreement";
import { agreementApi } from "@/api/agreementApi";
import { useAppSelector } from "@/store/hooks";
import { documentApi } from "@/api/documentApi";

export const useAgreement = (id: number | null) => {
  const user = useAppSelector((state) => state.auth.user);
  const [agreement, setAgreement] = useState<Agreement | null>(null);
  const [templateUrl, setTemplateUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAgreement = async () => {
    if (!id || !user) return;
    setLoading(true);
    setError(null);

    try {
      const data = await agreementApi.getAgreementById(id);
      setAgreement(data);
    } catch (err) {
      console.error(err);
      setError("Error al cargar el convenio");
      setAgreement(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplate = async () => {
    setLoading(true);
    try {
      const plantilla = await documentApi.getAgreementTemplate();
      setTemplateUrl(plantilla.fileUrl);
    } catch (err) {
      console.error("Error al cargar plantilla:", err);
      setError("No se pudo cargar la plantilla de convenio");
    } finally {
      setLoading(false);
    }
  };

  const createAgreement = async () => {
    setLoading(true);
    setError(null);
    try {
      const agreement = await agreementApi.createAgreement();
      setAgreement(agreement);

      return agreement;
    } catch (error) {
      console.error(error);
      setError("Error al crear el convenio");
    } finally {
      setLoading(false);
    }
  }

  const uploadSignedAgreement = async (file: File) => {
    if (!agreement) return;
    setLoading(true);
    try {
      const updated = await agreementApi.uploadSignedAgreement(agreement.id, file);
      setAgreement(updated);
      return updated;
    } catch (err) {
      console.error(err);
      setError("Error al subir el convenio firmado");
    } finally {
      setLoading(false);
    }
  };

  const sendForFinalReview = async () => {
    if (!agreement) return;
    setLoading(true);
    try {
      const updated = await agreementApi.sendForFinalReview(agreement.id);
      setAgreement(updated);
      return updated;
    } catch (err) {
      console.error(err);
      setError("Error al enviar el convenio a revisión final");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchAgreement();
    else fetchTemplate();
  }, [id, user?.id]);

  return {
    agreement,
    templateUrl,
    loading,
    error,
    fetchAgreement, 
    createAgreement,
    uploadSignedAgreement,
    sendForFinalReview,
  };
};
