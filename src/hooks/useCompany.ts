import { useState, useEffect } from "react";
import { companyApi } from "@/api/companyApi";
import type { ICompany } from "@/models/ICompany";


export const useCompany = () => {
    const [company, setCompany] = useState<ICompany | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                setLoading(true);
                setError(null);
                const company = await companyApi.getProfile();

                setCompany(company);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Error desconocido al obtener la información de la empresa");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchCompany();
    }, []);

    return { company, loading, error };
};
