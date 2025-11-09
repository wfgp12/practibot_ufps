import { useState, useEffect } from "react";
import type { Agreement } from "@/models/IAgreement";
import { agreementApi } from "@/api/agreementApi";
import { useAppSelector } from "@/store/hooks";

export const useAgreement = (id: number | null) => {
  const user = useAppSelector((state) => state.auth.user);
  const [agreement, setAgreement] = useState<Agreement | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAgreement = async () => {
    if (!id || !user) return;
    setLoading(true);
    setError(null);

    try {
      const data = await agreementApi.getAgreementById(id);
        console.log('data', data) 
        setAgreement(data);
    } catch (err) {
        console.log('cuela error gonorea', err)
      console.error(err);
      setError("Error al cargar el convenio");
      setAgreement(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgreement();
  }, [id, user?.id]);

  return { agreement, loading, error, fetchAgreement };
};
