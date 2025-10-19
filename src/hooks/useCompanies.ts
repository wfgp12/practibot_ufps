import { useState, useEffect, useCallback } from "react";
import { companyApi } from "@/api/companyApi";
import type { ICompany, IRegisterCompanyData } from "@/models/ICompany";
import type { IApiPaginatedResponse } from "@/models/IApi";

interface TableState<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    filters: Record<string, string>;
}
export const useCompanies = () => {
    const [companies, setCompanies] = useState<TableState<ICompany>>({
        data: [],
        total: 0,
        page: 1,
        pageSize: 10,
        filters: {},
    });

    const [pendingCompanies, setPendingCompanies] = useState<TableState<ICompany>>({
        data: [],
        total: 0,
        page: 1,
        pageSize: 10,
        filters: {},
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /** 📦 Obtener empresas (no pendientes) */
    const fetchCompanies = useCallback(
        async (params?: Partial<TableState<ICompany>>) => {
            try {
                setLoading(true);
                setError(null);

                const cleanFilters = Object.fromEntries(
                    Object.entries(params?.filters ?? {}).filter(
                        ([, value]) => value && value.toLowerCase() !== "all"
                    )
                );

                const query = {
                    page: params?.page ?? companies.page,
                    pageSize: params?.pageSize ?? companies.pageSize,
                    ...cleanFilters,
                };

                const response: IApiPaginatedResponse<ICompany> = await companyApi.getAll(query);

                setCompanies(prev => ({
                    ...prev,
                    data: response.data,
                    total: response.total,
                    page: response.page,
                    filters: params?.filters ?? prev.filters,
                }));
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "Error al obtener empresas");
            } finally {
                setLoading(false);
            }
        },
        [companies]
    );

    /** 📦 Obtener empresas pendientes */
    const fetchPendingCompanies = useCallback(
        async (params?: Partial<TableState<ICompany>>) => {
            try {
                setLoading(true);
                setError(null);

                const cleanFilters = Object.fromEntries(
                    Object.entries(params?.filters ?? {}).filter(
                        ([, value]) => value && value !== "ALL"
                    )
                );

                const query = {
                    page: params?.page ?? pendingCompanies.page,
                    pageSize: params?.pageSize ?? pendingCompanies.pageSize,
                    ...cleanFilters,
                };

                const response: IApiPaginatedResponse<ICompany> = await companyApi.getPending(query);

                setPendingCompanies(prev => ({
                    ...prev,
                    data: response.data,
                    total: response.total,
                    page: response.page,
                    filters: params?.filters ?? prev.filters,
                }));
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "Error al obtener empresas pendientes");
            } finally {
                setLoading(false);
            }
        },
        [pendingCompanies]
    );

    /** 🔁 Cargar ambos listados al iniciar */
    useEffect(() => {
        fetchCompanies();
        fetchPendingCompanies();
    }, []);

    const fetchCompanyById = useCallback(async (id: string | number) => {
        try {
            setLoading(true);
            const company = await companyApi.getById(id);
            return company;
        } catch (err: unknown) {
            if (err instanceof Error) setError(err.message);
            else setError("Error desconocido al obtener empresa");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    /** ✅ Aprobar empresa */
    const approveCompany = useCallback(async (id: string | number) => {
        try {
            setLoading(true);
            const updated = await companyApi.approve(id);
            setPendingCompanies(prev => ({
                ...prev,
                data: prev.data.filter(c => c.id !== id),
                total: prev.total - 1,
            }));
            setCompanies(prev => ({
                ...prev,
                data: [updated, ...prev.data],
                total: prev.total + 1,
            }));
            return updated;
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Error al aprobar empresa");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    /** ❌ Rechazar empresa */
    const rejectCompany = useCallback(async (id: string | number) => {
        try {
            setLoading(true);
            await companyApi.reject(id);
            setPendingCompanies(prev => ({
                ...prev,
                data: prev.data.filter(c => c.id !== id),
                total: prev.total - 1,
            }));
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Error al rechazar empresa");
        } finally {
            setLoading(false);
        }
    }, []);

    /** 🔄 Cambiar estado */
    const toggleCompanyState = useCallback(async (id: string | number, estado: "APROBADA" | "INACTIVA") => {
        try {
            setLoading(true);
            const updated = await companyApi.toggleState(id, estado);
            setCompanies(prev => ({
                ...prev,
                data: prev.data.map(c => (c.id === id ? updated : c)),
            }));
            return updated;
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Error al cambiar estado de empresa");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    /** 🏗️ Crear empresa */
    const createCompany = useCallback(async (data: IRegisterCompanyData) => {
        try {
            setLoading(true);
            await companyApi.create(data);
            await fetchCompanies();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Error al crear empresa");
        } finally {
            setLoading(false);
        }
    }, [fetchCompanies]);

    /** 🔄 Actualizar empresa */
    const updateCompany = useCallback(
        async (id: string, data: IRegisterCompanyData) => {
            try {
                setLoading(true);
                const updated = await companyApi.update(id, data);

                // Actualiza la empresa en la lista general
                setCompanies(prev => ({
                    ...prev,
                    data: prev.data.map(c => (c.id === id ? updated : c)),
                }));

                // También actualiza en pendientes si existiera
                setPendingCompanies(prev => ({
                    ...prev,
                    data: prev.data.map(c => (c.id === id ? updated : c)),
                }));

                return updated;
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "Error al actualizar empresa");
                return null;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    return {
        companies,
        pendingCompanies,
        loading,
        error,
        fetchCompanies,
        fetchPendingCompanies,
        fetchCompanyById,
        approveCompany,
        rejectCompany,
        toggleCompanyState,
        createCompany,
        updateCompany,
    };
};
