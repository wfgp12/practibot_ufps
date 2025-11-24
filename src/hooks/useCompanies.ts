import { useState, useEffect, useCallback } from "react";
import { companyApi } from "@/api/companyApi";
import type { ICompany, IRegisterCompanyData } from "@/models/ICompany";
export const useCompanies = () => {
    const [companies, setCompanies] = useState<ICompany[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [filters, setFilters] = useState<Partial<Record<keyof ICompany, unknown>>>({});
    const [loading, setLoading] = useState(false);

    const [pendingCompanies, setPendingCompanies] = useState<ICompany[]>([]);
    const [pendingTotal, setPendingTotal] = useState(0);
    const [pendingPage, setPendingPage] = useState(1);
    const [pendingPageSize, setPendingPageSize] = useState(10);
    const [pendingFilters, setPendingFilters] = useState<Partial<Record<keyof ICompany, unknown>>>({});
    const [pendingLoading, setPendingLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /** 📦 Obtener empresas (no pendientes) */
    const fetchCompanies = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const cleanFilters = Object.fromEntries(
                Object.entries(filters ?? {}).filter(
                    ([, value]) => value && value?.toString().toLowerCase() !== "all"
                )
            );

            const response = await companyApi.getAll({
                page,
                pageSize,
                ...cleanFilters,
            });

            setCompanies(response.data);
            setTotal(response.total);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Error al obtener empresas");
        } finally {
            setLoading(false);
        }
    },
        [page, pageSize, filters]
    );

    /** 📦 Obtener empresas pendientes */
    const fetchPendingCompanies = useCallback(
        async () => {
            try {
                setPendingLoading(true);
                setError(null);

                const cleanFilters = Object.fromEntries(
                    Object.entries(pendingFilters ?? {}).filter(
                        ([, value]) => value && value?.toString().toLowerCase() !== "all"
                    )
                );

                const response = await companyApi.getPending({
                    page: pendingPage,
                    pageSize: pendingPageSize,
                    ...cleanFilters,
                });

                setPendingCompanies(response.data)
                setPendingTotal(response.total);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "Error al obtener empresas pendientes");
            } finally {
                setPendingLoading(false);
            }
        },
        [pendingPage, pendingPageSize, pendingFilters]
    );

    useEffect(() => {
        fetchCompanies();
    }, [fetchCompanies]);
    useEffect(() => {
        fetchPendingCompanies();
    }, [fetchPendingCompanies]);

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

            setPendingCompanies(prev => prev.filter(c => c.id !== id));
            setCompanies(prev => [updated, ...prev]);
            setTotal(prev => prev + 1);

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

            setPendingCompanies(prev => prev.filter(c => c.id !== id));
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

            setCompanies(prev =>
                prev.map(c => (c.id === id ? updated : c))
            );

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
    const updateCompany = useCallback(async (id: number, data: IRegisterCompanyData) => {
        try {
            setLoading(true);
            const updated = await companyApi.update(id, data);

            // Actualizar en aprobadas
            setCompanies(prev =>
                prev.map(c => (c.id === id ? updated : c))
            );

            // Actualizar en pendientes si existe
            setPendingCompanies(prev =>
                prev.map(c => (c.id === id ? updated : c))
            );

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

    const uploadCompanies = useCallback(async (file: File) => {
        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append("archivo", file);

        try {
            const res = await companyApi.uploadMassive(formData);
            await fetchCompanies();
            await fetchPendingCompanies();
            return res;
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : "Error al cargar empresas";
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        /** Empresas normales */
        companies,
        total,
        page,
        pageSize,
        filters,

        /** Pendientes */
        pendingCompanies,
        pendingTotal,
        pendingPage,
        pendingPageSize,
        pendingFilters,

        /** Estados */
        loading,
        pendingLoading,
        error,

        /** Setters */
        setPage,
        setPageSize,
        setFilters,
        setPendingPage,
        setPendingPageSize,
        setPendingFilters,
        setTotal,

        /** Actions */
        fetchCompanies,
        fetchPendingCompanies,
        fetchCompanyById,
        approveCompany,
        rejectCompany,
        toggleCompanyState,
        createCompany,
        updateCompany,
        uploadCompanies
    };
};
