import { useEffect, useState, useCallback } from "react";
import type { IFormCreateVacancy, Vacancy } from "@/models/IVacancy";
import { vacanciesApi } from "@/api/vacanciesApi";

interface UseVacanciesReturn {
    vacancies: Vacancy[];
    pendingVacancies: Vacancy[];
    loading: boolean;
    error: string | null;
    fetchVacancies: () => Promise<void>;
    fetchVacancyById: (id: string) => Promise<Vacancy | null>;
    addVacancy: (vacancy: IFormCreateVacancy) => Promise<void>;
    approveVacancy: (id: string) => Promise<void>;
    rejectVacancy: (id: string) => Promise<void>;
    toggleVacancyStatus: (id: string) => Promise<void>;
    removeVacancy: (id: string) => void;
}

export const useVacancies = (): UseVacanciesReturn => {
    const [vacancies, setVacancies] = useState<Vacancy[]>([]);
    const [pendingVacancies, setPendingVacancies] = useState<Vacancy[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    /** 🔄 Obtener vacantes desde el backend */
    const fetchVacancies = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [approved, pending] = await Promise.all([
                vacanciesApi.getApproved(),
                vacanciesApi.getPending(),
            ]);

            setVacancies(approved);
            setPendingVacancies(pending);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchVacancyById = useCallback(async (id: string): Promise<Vacancy | null> => {
        setLoading(true);
        setError(null);
        try {
            const vacante = await vacanciesApi.getById(id);
            return vacante;
        } catch (err) {
            setError((err as Error).message);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    /** 🆕 Crear una nueva vacante (queda pendiente) */
    const addVacancy = async (formData: IFormCreateVacancy) => {
        const newVacancy = await vacanciesApi.create(formData);
        setVacancies((prev) => [...prev, newVacancy]);
    };


    /** 🟢 Aprobar una vacante pendiente */
    const approveVacancy = async (id: string) => {
        try {
            await vacanciesApi.approve(id);
            await fetchVacancies();
        } catch (err) {
            setError((err as Error).message);
        }
    };

    /** 🔴 Rechazar una vacante pendiente */
    const rejectVacancy = async (id: string) => {
        try {
            await vacanciesApi.reject(id);
            await fetchVacancies();
        } catch (err) {
            setError((err as Error).message);
        }
    };

    /** ✏️ Alternar estado (Open / Closed) */
    const toggleVacancyStatus = async (id: string) => {
        try {
            await vacanciesApi.toggleStatus(id);
            await fetchVacancies();
        } catch (err) {
            setError((err as Error).message);
        }
    };

    /** 🗑️ Eliminar vacante localmente (si aplica) */
    const removeVacancy = (id: string) => {
        setVacancies((prev) => prev.filter((v) => v.id !== id));
    };

    // Llamar automáticamente al cargar el componente
    useEffect(() => {
        fetchVacancies();
    }, [fetchVacancies]);

    return {
        vacancies,
        pendingVacancies,
        loading,
        error,
        fetchVacancies,
        fetchVacancyById,
        addVacancy,
        approveVacancy,
        rejectVacancy,
        toggleVacancyStatus,
        removeVacancy,
    };
};
