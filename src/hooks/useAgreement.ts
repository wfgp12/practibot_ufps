import { useEffect, useState } from "react";
import axios from "axios";
import type { Agreement } from "@/models/IAgreement";
import { mapAgreementFromApi } from "@/models/IAgreement";

export const useAgreements = (companyId?: number) => {
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAgreements = async () => {
    if (!companyId) return;
    setLoading(true);
    try {
      const res = await axios.get(`/api/convenios/empresa/${companyId}`);
      const data = Array.isArray(res.data) ? res.data : [res.data];
      setAgreements(data.map(mapAgreementFromApi));
    } catch (err) {
      console.error(err);
      setError("Error al cargar los convenios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgreements();
  }, [companyId]);

  return { agreements, loading, error, fetchAgreements };
};
