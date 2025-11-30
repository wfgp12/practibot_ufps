import { useEffect, useState, useCallback } from "react";
import {
  mapVacancyFiltersToApi,
  type IFormCreateVacancy,
  type IFormRegisterVacancy,
  type Vacancy,
} from "@/models/IVacancy";
import { vacanciesApi } from "@/api/vacanciesApi";
import type { CompanyOption } from "@/models/ICompany";
import { companyApi } from "@/api/companyApi";
import type { IApiPaginatedResponse } from "@/models/IApi";
import { useAppSelector } from "@/store/hooks";

interface TableState<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  filters: Record<string, string>;
}

interface ApiError extends Error {
  message: string;
}

export const useVacancies = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [vacancies, setVacancies] = useState<TableState<Vacancy>>({ data: [], total: 0, page: 1, pageSize: 10, filters: {} });
  const [pendingVacancies, setPendingVacancies] = useState<TableState<Vacancy>>({ data: [], total: 0, page: 1, pageSize: 10, filters: {} });
  const [companyVacancies, setCompanyVacancies] = useState<TableState<Vacancy>>({ data: [], total: 0, page: 1, pageSize: 10, filters: {} });
  const [companiesList, setCompaniesList] = useState<CompanyOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** 🟢 Helper genérico para obtener tabla de vacantes
   *  NOTE: endpoint must return IApiPaginatedResponse<Vacancy> (vacanciesApi already maps API -> Vacancy)
   */
  const fetchTableData = useCallback(
    (
      endpoint: (params: Record<string, string | number>) => Promise<IApiPaginatedResponse<Vacancy>>,
      setter: React.Dispatch<React.SetStateAction<TableState<Vacancy>>>,
      params?: Partial<TableState<Vacancy>>
    ) => {
      setLoading(true);
      setError(null);

      const cleanFilters = Object.fromEntries(
        Object.entries(params?.filters ?? {}).filter(([, value]) => value && value.toLowerCase() !== "all")
      );

      const query = {
        page: params?.page ?? 1,
        limit: params?.pageSize ?? 10,
        ...mapVacancyFiltersToApi(cleanFilters),
      };

      endpoint(query)
        .then((response) => {
          setter((prev) => ({
            ...prev,
            data: response.data, // already Vacancy[]
            total: response.total,
            page: response.page,
            pageSize: params?.pageSize ?? prev.pageSize,
            filters: params?.filters ?? prev.filters,
          }));
        })
        .catch((err: ApiError) => {
          setError(err?.message ?? "Error al obtener datos");
        })
        .finally(() => {
          setLoading(false);
        });
    },
    []
  );

  const fetchVacancies = useCallback(
    (params?: Partial<TableState<Vacancy>>) => fetchTableData(vacanciesApi.getApproved, setVacancies, params),
    [fetchTableData]
  );

  const fetchPendingVacancies = useCallback(
    (params?: Partial<TableState<Vacancy>>) => fetchTableData(vacanciesApi.getPending, setPendingVacancies, params),
    [fetchTableData]
  );

  const fetchCompanyVacancies = useCallback(
    (params?: Partial<TableState<Vacancy>>) => fetchTableData(vacanciesApi.getByCompany, setCompanyVacancies, params),
    [fetchTableData]
  );

  const fetchPersonalizedVacancies = useCallback(
    (params?: Partial<TableState<Vacancy>>) =>
      fetchTableData(vacanciesApi.getPersonalized, setVacancies, params),
    [fetchTableData]
  );

  const fetchListCompanies = useCallback((estados?: string[]) => {
    setLoading(true);
    const query = estados ? `?estados=${estados.join(",")}` : "";

    companyApi.listCompanies(query)
      .then(setCompaniesList)
      .catch((err: ApiError) => setError(err?.message ?? "Error al obtener empresas"))
      .finally(() => setLoading(false));
  }, []);


  const fetchVacancyById = useCallback((id: string): Promise<Vacancy | null> => {
    setLoading(true);
    return vacanciesApi.getById(id)
      .then((v) => v)
      .catch((err: ApiError) => {
        setError(err?.message ?? "Error al obtener vacante");
        return null;
      })
      .finally(() => setLoading(false));
  }, []);

  const addVacancy = useCallback((formData: IFormCreateVacancy) => {
    setLoading(true);
    vacanciesApi.create(formData)
      .then(() => fetchPendingVacancies())
      .catch((err: ApiError) => setError(err?.message ?? "Error al crear vacante"))
      .finally(() => setLoading(false));
  }, [fetchPendingVacancies]);

  const registerVacancy = useCallback(async (formData: IFormRegisterVacancy) => {
    setLoading(true);
    try {
      await vacanciesApi.registerApproved(formData)
      fetchVacancies()
    } catch (error) {
      console.error(error);
      setError((error as ApiError)?.message ?? "Error al registrar vacante"); 
    } finally {
      setLoading(false);
    }
  }, [fetchVacancies]);

  const updateVacancy = useCallback((formData: IFormRegisterVacancy, id: string) => {
    setLoading(true);
    vacanciesApi.updateAdminDirector(id, formData)
      .then(() => fetchVacancies())
      .catch((err: ApiError) => setError(err?.message ?? "Error al actualizar la vacante"))
      .finally(() => setLoading(false));
  }, [fetchVacancies]);

  const approveVacancy = useCallback((id: string) => {
    setLoading(true);
    vacanciesApi.approve(id)
      .then(() => {
        setPendingVacancies((prev) => ({
          ...prev,
          data: prev.data.filter((v) => v.id !== id),
          total: Math.max(0, prev.total - 1),
        }));
        return fetchVacancies();
      })
      .catch((err: ApiError) => setError(err?.message ?? "Error al aprobar vacante"))
      .finally(() => setLoading(false));
  }, [fetchVacancies]);

  const rejectVacancy = useCallback((id: string) => {
    setLoading(true);
    vacanciesApi.reject(id)
      .then(() => {
        setPendingVacancies((prev) => ({
          ...prev,
          data: prev.data.filter((v) => v.id !== id),
          total: Math.max(0, prev.total - 1),
        }));
      })
      .catch((err: ApiError) => setError(err?.message ?? "Error al rechazar vacante"))
      .finally(() => setLoading(false));
  }, []);

  const toggleVacancyStatus = useCallback((vacante: Vacancy) => {
    setLoading(true);
    const promise = vacante.status === "Closed" ? vacanciesApi.activate(vacante.id) : vacanciesApi.inactivate(vacante.id);
    promise
      .then(() => fetchVacancies())
      .catch((err: ApiError) => setError(err?.message ?? "Error al cambiar estado de la vacante"))
      .finally(() => setLoading(false));
  }, [fetchVacancies]);

  useEffect(() => {
    const loadVacancies = () => {
      if (!user) {
        fetchVacancies();
        return;
      }

      switch (user.role) {
        case "ADMIN":
        case "DIRECTOR":
          fetchVacancies();
          fetchPendingVacancies();
          break;
        case "EMPRESA":
          fetchCompanyVacancies();
          break;
        case "ESTUDIANTE":
          fetchPersonalizedVacancies();
          break;
        default:
          fetchVacancies();
      }
    };
    loadVacancies();
  }, [user, fetchVacancies, fetchPendingVacancies, fetchCompanyVacancies, fetchPersonalizedVacancies]);

  return {
    vacancies,
    pendingVacancies,
    companyVacancies,
    companiesList,
    loading,
    error,
    fetchVacancies,
    fetchPendingVacancies,
    fetchCompanyVacancies,
    fetchVacancyById,
    addVacancy,
    approveVacancy,
    rejectVacancy,
    toggleVacancyStatus,
    fetchListCompanies,
    registerVacancy,
    updateVacancy,
  };
};
