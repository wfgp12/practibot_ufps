import { useState, useEffect, useCallback } from "react";
import { companyApi } from "@/api/companyApi";
import type { ICompany } from "@/models/ICompany";

export const useCompanies = () => {
  const [pendingCompanies, setPendingCompanies] = useState<ICompany[]>([]);
  const [companies, setCompanies] = useState<ICompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        setError(null);

        const [pendingCompanies, companies] = await Promise.all([
          companyApi.getPending(), 
          companyApi.getAll(),     
        ]);

        console.log(pendingCompanies, companies);

        setPendingCompanies(pendingCompanies);
        setCompanies(companies);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error desconocido al obtener la información de las empresas");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
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

  return { pendingCompanies, companies, loading, error, fetchCompanyById };
};
