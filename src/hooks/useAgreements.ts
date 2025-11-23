import { useEffect, useState, useCallback } from "react";
import { mapAgreementFiltersToApi, type Agreement, type IMassiveCreatedAgreement, type IMassiveFailedAgreement } from "@/models/IAgreement";
import { agreementApi } from "@/api/agreementApi";
import { useAppSelector } from "@/store/hooks";

export const useAgreements = (companyId?: number) => {
  const user = useAppSelector((state) => state.auth.user);

  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [pendingAgreements, setPendingAgreements] = useState<Agreement[]>([]);
  const [totalPending, setTotalPending] = useState(0);
  const [pagePending, setPagePending] = useState(1);
  const [pageSizePending, setPageSizePending] = useState(10);

  const [filters, setFilters] = useState<Record<string, unknown>>({});
  const [pendingFilters, setPendingFilters] = useState<Record<string, unknown>>({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** 🔹 Cargar convenios normales */
  const fetchAgreements = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const apiFilters = mapAgreementFiltersToApi(filters);

      let resp;

      if (user?.role === "EMPRESA") {
        resp = await agreementApi.listMyAgreements(page, pageSize, apiFilters);
      } else if (companyId) {
        resp = await agreementApi.listAgreementsByCompanyId(companyId, page, pageSize, apiFilters);
      } else {
        resp = await agreementApi.listAgreements(page, pageSize, apiFilters);
      }

      setAgreements(resp.data);
      setTotal(resp.total);
      setPage(resp.page);
      setPageSize(resp.pageSize);
    } catch (err) {
      console.error(err);
      setError("Error al cargar convenios");
    } finally {
      setLoading(false);
    }
  }, [user?.role, companyId, page, pageSize, filters]);

  /** 🔹 Cargar convenios pendientes (solo director/admin) */
  const fetchPending = useCallback(async () => {
    if (user?.role === "EMPRESA") return;

    setLoading(true);
    setError(null);

    try {
      const apiFilters = mapAgreementFiltersToApi(pendingFilters);

      const resp = await agreementApi.listPendingAgreements(
        pagePending,
        pageSizePending,
        apiFilters
      );

      setPendingAgreements(resp.data);
      setTotalPending(resp.total);
      setPagePending(resp.page);
      setPageSizePending(resp.pageSize);
    } catch (err) {
      console.error(err);
      setError("Error al cargar convenios pendientes");
    } finally {
      setLoading(false);
    }
  }, [user?.role, pagePending, pageSizePending, pendingFilters]);

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

  const uploadMassiveAgreements = async (
    archivoData: File,
    archivos: File[]
  ): Promise<{
    created: IMassiveCreatedAgreement[];
    failed: IMassiveFailedAgreement[];
  }> => {
    try {
      setLoading(true);
      setError(null);

      const resp = await agreementApi.uploadMassiveAgreements(
        archivoData,
        archivos
      );
      await fetchAgreements();
      await fetchPending();

      return resp;
    } catch (err) {
      console.error(err);
      setError("Error al cargar convenios masivamente");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgreements();
  }, [fetchAgreements]);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  return {
    agreements,
    total,
    page,
    pageSize,
    pendingAgreements,
    totalPending,
    pagePending,
    pageSizePending,
    filters,
    pendingFilters,
    loading,
    error,
    setPage,
    setPagePending,
    setPageSize,
    setPageSizePending,
    setFilters,
    setPendingFilters,
    fetchAgreements,
    fetchPending,
    createAgreementByDirector,
    uploadMassiveAgreements
  };
};
