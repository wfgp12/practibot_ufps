import { useEffect, useState, useCallback } from "react";
import { mapVacancyFiltersToApi, type IFormCreateVacancy, type IFormRegisterVacancy, type Vacancy } from "@/models/IVacancy";
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

export const useVacancies = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [vacancies, setVacancies] = useState<TableState<Vacancy>>({
    data: [],
    total: 0,
    page: 1,
    pageSize: 10,
    filters: {},
  });

  const [pendingVacancies, setPendingVacancies] = useState<TableState<Vacancy>>({
    data: [],
    total: 0,
    page: 1,
    pageSize: 10,
    filters: {},
  });

  const [companyVacancies, setCompanyVacancies] = useState<TableState<Vacancy>>({
    data: [],
    total: 0,
    page: 1,
    pageSize: 10,
    filters: {},
  });

  const [companiesList, setCompaniesList] = useState<CompanyOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** 📦 Obtener vacantes aprobadas */
  const fetchVacancies = useCallback(
    async (params?: Partial<TableState<Vacancy>>) => {
      try {
        setLoading(true);
        setError(null);

        // 🔹 Limpiar filtros (evita enviar valores vacíos o "all")
        const cleanFilters = Object.fromEntries(
          Object.entries(params?.filters ?? {}).filter(
            ([, value]) => value && value.toLowerCase() !== "all"
          )
        );

        const mappedFilters = mapVacancyFiltersToApi(cleanFilters);

        const query = {
          page: params?.page ?? vacancies.page,
          limit: params?.pageSize ?? vacancies.pageSize,
          ...mappedFilters,
        };

        const response: IApiPaginatedResponse<Vacancy> =
          await vacanciesApi.getApproved(query);

        setVacancies((prev) => ({
          ...prev,
          data: response.data,
          total: response.total,
          page: response.page,
          pageSize: params?.pageSize ?? prev.pageSize,
          filters: params?.filters ?? prev.filters,
        }));
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Error al obtener vacantes aprobadas");
      } finally {
        setLoading(false);
      }
    },
    [vacancies.page, vacancies.pageSize]
  );

  /** 📦 Obtener vacantes pendientes */
  const fetchPendingVacancies = useCallback(
    async (params?: Partial<TableState<Vacancy>>) => {
      try {
        setLoading(true);
        setError(null);

        const cleanFilters = Object.fromEntries(
          Object.entries(params?.filters ?? {}).filter(
            ([, value]) => value && value.toLowerCase() !== "all"
          )
        );

        const mappedFilters = mapVacancyFiltersToApi(cleanFilters);

        const query = {
          page: params?.page ?? pendingVacancies.page,
          limit: params?.pageSize ?? pendingVacancies.pageSize,
          ...mappedFilters,
        };

        const response: IApiPaginatedResponse<Vacancy> =
          await vacanciesApi.getPending(query);

        setPendingVacancies((prev) => ({
          ...prev,
          data: response.data,
          total: response.total,
          page: response.page,
          pageSize: params?.pageSize ?? prev.pageSize,
          filters: params?.filters ?? prev.filters,
        }));
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Error al obtener vacantes pendientes");
      } finally {
        setLoading(false);
      }
    },
    [pendingVacancies.page, pendingVacancies.pageSize]
  );

  const fetchCompanyVacancies = useCallback(
    async (params?: Partial<TableState<Vacancy>>) => {
      try {
        setLoading(true);
        setError(null);

        const cleanFilters = Object.fromEntries(
          Object.entries(params?.filters ?? {}).filter(
            ([, value]) => value && value.toLowerCase() !== "all"
          )
        );

        const mappedFilters = mapVacancyFiltersToApi(cleanFilters);

        const query = {
          page: params?.page ?? companyVacancies.page,
          limit: params?.pageSize ?? companyVacancies.pageSize,
          ...mappedFilters,
        };

        // 🔹 Petición al endpoint de la empresa (requiere token de la empresa)
        const response: IApiPaginatedResponse<Vacancy> =
          await vacanciesApi.getByCompany(query); // <- nuevo endpoint en backend

        setCompanyVacancies((prev) => ({
          ...prev,
          data: response.data,
          total: response.total,
          page: response.page,
          pageSize: params?.pageSize ?? prev.pageSize,
          filters: params?.filters ?? prev.filters,
        }));
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Error al obtener vacantes de la empresa");
      } finally {
        setLoading(false);
      }
    },
    [companyVacancies.page, companyVacancies.pageSize]
  );

  /** 🏢 Listado de empresas */
  const fetchListCompanies = useCallback(async () => {
    try {
      setLoading(true);
      const data = await companyApi.listCompanies();
      setCompaniesList(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al obtener empresas");
    } finally {
      setLoading(false);
    }
  }, []);

  /** 🔍 Obtener vacante por ID */
  const fetchVacancyById = useCallback(async (id: string): Promise<Vacancy | null> => {
    try {
      setLoading(true);
      const vacante = await vacanciesApi.getById(id);
      return vacante;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al obtener vacante");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /** 🆕 Crear vacante */
  const addVacancy = useCallback(
    async (formData: IFormCreateVacancy) => {
      try {
        setLoading(true);
        await vacanciesApi.create(formData);
        await fetchPendingVacancies();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al crear vacante");
      } finally {
        setLoading(false);
      }
    },
    [fetchPendingVacancies]
  );

  /** 📝 Registrar vacante aprobada */
  const registerVacancy = useCallback(
    async (formData: IFormRegisterVacancy) => {
      try {
        setLoading(true);
        await vacanciesApi.registerApproved(formData);
        await fetchVacancies();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al registrar vacante");
      } finally {
        setLoading(false);
      }
    },
    [fetchVacancies]
  );

  const updateVacancy = useCallback(
    async (formData: IFormRegisterVacancy, id?: string) => {
      try {
        setLoading(true);
        await vacanciesApi.updateAdminDirector(id!, formData);
        await fetchVacancies();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al actualizar la vacante");
      } finally {
        setLoading(false);
      }
    },
    [fetchVacancies]
  );

  /** 🟢 Aprobar vacante */
  const approveVacancy = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        await vacanciesApi.approve(id);
        setPendingVacancies((prev) => ({
          ...prev,
          data: prev.data.filter((v) => v.id !== id),
          total: prev.total - 1,
        }));
        await fetchVacancies();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al aprobar vacante");
      } finally {
        setLoading(false);
      }
    },
    [fetchVacancies]
  );

  /** ❌ Rechazar vacante */
  const rejectVacancy = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await vacanciesApi.reject(id);
      setPendingVacancies((prev) => ({
        ...prev,
        data: prev.data.filter((v) => v.id !== id),
        total: prev.total - 1,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al rechazar vacante");
    } finally {
      setLoading(false);
    }
  }, []);

  /** ⚙️ Cambiar estado (activar o inactivar) */
  const toggleVacancyStatus = useCallback(
    async (vacante: Vacancy) => {
      try {
        setLoading(true);

        if (vacante.status === "Closed") {
          // Si está inactiva o cerrada → activarla
          await vacanciesApi.activate(vacante.id);
        } else {
          // Si está activa → inactivarla
          await vacanciesApi.inactivate(vacante.id);
        }

        // 🔄 Refrescar lista principal
        await fetchVacancies();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cambiar estado de la vacante");
      } finally {
        setLoading(false);
      }
    },
    [fetchVacancies]
  );

useEffect(() => {
  const loadVacancies = async () => {
    if (!user) {
      // No hay usuario: solo cargamos vacantes aprobadas (home)
      await fetchVacancies();
      return;
    }

    // Usuario logueado: cargamos según su rol
    if (user.role === "ADMIN" || user.role === "DIRECTOR") {
      await fetchVacancies();
      await fetchPendingVacancies();
    } else if (user.role === "EMPRESA") {
      await fetchCompanyVacancies();
    } else {
      await fetchVacancies(); // otros roles, por ejemplo estudiante
    }
  };

  loadVacancies();
}, [user, fetchVacancies, fetchPendingVacancies, fetchCompanyVacancies]);
  
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
