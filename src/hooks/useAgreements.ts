import { useEffect, useState, useCallback } from "react";
import { mapAgreementFiltersToApi, type Agreement } from "@/models/IAgreement";
import { agreementApi } from "@/api/agreementApi";
import { useAppSelector } from "@/store/hooks";

export const useAgreements = (companyId?: number) => {
  const user = useAppSelector((state) => state.auth.user);

  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** 🔹 Cargar convenios según rol y filtros */
  const fetchAgreements = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let response;

      const apiFilters = mapAgreementFiltersToApi(filters);

      // Empresa autenticada
      if (user?.role === "EMPRESA") {
        response = await agreementApi.listMyAgreements(page, pageSize, apiFilters);
      }
      // Director/Admin viendo los convenios de una empresa
      else if (companyId) {
        response = await agreementApi.listAgreementsByCompanyId(companyId, page, pageSize, apiFilters);
      }
      // Director/Admin viendo todos los convenios
      else {
        response = await agreementApi.listAllAgreements(page, pageSize, filters);
      }

      setAgreements(response.data);
      setTotal(response.total);
    } catch (err) {
      console.error(err);
      setError("Error al cargar los convenios");
    } finally {
      setLoading(false);
    }
  }, [user?.role, companyId, page, pageSize, filters]);

  /** 🔹 Crear convenio (solo director/admin) */
  const createAgreementByDirector = async (
    formData: {
      empresaId: number;
      nombre: string;
      descripcion?: string;
      tipo: "MACRO" | "ESPECIFICO";
      observaciones?: string;
      file?: File;
      fechaInicio: string;
      fechaFin: string;
      estado: "EN_REVISION" | "APROBADO" | "RECHAZADO";
    }
  ) => {
    try {
      setLoading(true);
      const newAgreement = await agreementApi.createByDirector(formData);
      setAgreements((prev) => [newAgreement, ...prev]); 
      return newAgreement;
    } catch (err) {
      console.error(err);
      setError("Error al crear el convenio");
      throw err;
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  fetchAgreements();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [page, pageSize, filters, companyId]);

  return {
    agreements,
    total,
    page,
    pageSize,
    setPage,
    setPageSize,
    filters,
    setFilters,
    loading,
    error,
    fetchAgreements,
    createAgreementByDirector,
  };
};
