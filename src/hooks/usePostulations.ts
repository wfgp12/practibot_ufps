import { PostulationApi } from "@/api/postulationApi";
import { type IApiPostulation, type IPostulation } from "@/models/IPostulation";
import { useCallback, useEffect, useState } from "react";

type FilterPostulations = Pick<IApiPostulation, "estado" | "fechaPostula"> & {
    estudiante?: string;
    vacante?: string;
}

export const usePostulations = (vacancyId?: number) => {
    const [postulaciones, setPostulaciones] = useState<IPostulation[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [filters, setFilters] = useState<Partial<FilterPostulations>>({});

    const fetchPostulations = useCallback(async () => {
        setLoading(true);
        console.log(vacancyId)
        try {
            if (vacancyId) {
                const response = await PostulationApi.getByVacancy(vacancyId, filters.estado, page, pageSize);
                setPostulaciones(response.data);
            } else {
                const response = await PostulationApi.getByCompany({ ...filters, page, limit: pageSize });
                setPostulaciones(response.data);
            }
        } catch (err: unknown) {
            console.error(err);

            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Error al obtener postulaciones");
            }
        } finally {
            setLoading(false);
        }
    }, [filters, page, pageSize, vacancyId]);

    useEffect(() => {
        fetchPostulations();
    }, [fetchPostulations])


    return {
        postulaciones,
        loading,
        error,
        page,
        pageSize,
        setFilters,
        setPage,
        setPageSize,
        fetchPostulations,
    }
}
