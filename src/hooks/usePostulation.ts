import { PostulationApi } from "@/api/postulationApi";
import { convertirEstadoFrontAApi, type IPostulation } from "@/models/IPostulation"
import { useCallback, useEffect, useState } from "react"


export const usePostulation = (postulationId: number) => {
    const [postulation, setPostulation] = useState<IPostulation>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPostulations = useCallback(async () => {
        setLoading(true);
        try {
            if (!postulationId) return
            const response = await PostulationApi.getById(postulationId);
            setPostulation(response);
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
    }, [postulationId]);

    const updatePostulationStatus = useCallback(
        async (estado: IPostulation["status"]) => {
            if (!postulation?.id) return;
            setLoading(true);
            try {
                const updated = await PostulationApi.updateStatus(postulation.id, convertirEstadoFrontAApi(estado));

                setPostulation(updated)

                return updated;
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
        },
        [postulation]
    );


    useEffect(() => {
        fetchPostulations();
        return () => {
            setPostulation(undefined);
        }
    }, [fetchPostulations])


    return {
        postulacion: postulation,
        loading,
        error,
        fetchPostulations,
        updatePostulationStatus
    }
}
