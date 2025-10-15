import { useState, useEffect, useCallback } from "react";
import { companyApi } from "@/api/companyApi";
import type { ICompany } from "@/models/ICompany";

export const useCompanies = () => {
    const [pendingCompanies, setPendingCompanies] = useState<ICompany[]>([]);
    const [companies, setCompanies] = useState<ICompany[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /** 🔄 Obtener todas las empresas y pendientes */
    const fetchCompanies = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const [pending, all] = await Promise.all([
                companyApi.getPending(),
                companyApi.getAll(),
            ]);

            setPendingCompanies(pending);
            setCompanies(all);
        } catch (err: unknown) {
            if (err instanceof Error) setError(err.message);
            else setError("Error desconocido al obtener la información de las empresas");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCompanies();
    }, [fetchCompanies]);

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

    /** ✅ Aprobar empresa pendiente */
    const approveCompany = useCallback(async (id: string | number) => {
        try {
            setLoading(true);
            const updated = await companyApi.approve(id);

            // Actualizar listas
            setPendingCompanies(prev => prev.filter(c => c.id !== id));
            setCompanies(prev => [updated, ...prev]);

            return updated;
        } catch (err: unknown) {
            if (err instanceof Error) setError(err.message);
            else setError("Error desconocido al aprobar empresa");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    /** ❌ Rechazar empresa pendiente */
    const rejectCompany = useCallback(async (id: string | number) => {
        try {
            setLoading(true);
            const updated = await companyApi.reject(id);

            // Actualizar listas
            setPendingCompanies(prev => prev.filter(c => c.id !== id));
            setCompanies(prev => [updated, ...prev]);

            return updated;
        } catch (err: unknown) {
            if (err instanceof Error) setError(err.message);
            else setError("Error desconocido al rechazar empresa");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    /** 🔄 Cambiar estado de empresa (APROBADA ↔ INACTIVA) */
    const toggleCompanyState = useCallback(
        async (id: string | number, estado: "APROBADA" | "INACTIVA") => {
            try {
                setLoading(true);
                const updated = await companyApi.toggleState(id, estado);

                // Actualizar lista de empresas
                setCompanies(prev =>
                    prev.map(c => (c.id === id ? updated : c))
                );

                return updated;
            } catch (err: unknown) {
                if (err instanceof Error) setError(err.message);
                else setError("Error desconocido al cambiar estado de empresa");
                return null;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    return {
        pendingCompanies,
        companies,
        loading,
        error,
        fetchCompanyById,
        fetchCompanies,
        approveCompany,
        rejectCompany,
        toggleCompanyState,
    };
};
