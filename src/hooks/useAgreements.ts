import { useEffect, useState } from "react";
import type { Agreement } from "@/models/IAgreement";
import { agreementApi } from "@/api/agreementApi";
import { useAppSelector } from "@/store/hooks";

export const useAgreements = (companyId?: number) => {
  const user = useAppSelector((state) => state.auth.user);
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAgreements = async () => {
    if (companyId === undefined) return;
    setLoading(true);
    setError(null);

    try {
      let data: Agreement[] = [];

      if (companyId) {
        if(user?.role === "EMPRESA"){
          data = await agreementApi.listMyAgreements();
        }else{
          data = await agreementApi.listAgreementsByCompanyId(companyId);
        }
      } else {
        data = await agreementApi.listAllAgreements();
      }

      setAgreements(data);
    } catch (err) {
      console.error(err);
      setError("Error al cargar los convenios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (companyId === undefined) {
      fetchAgreements();
      return;
    }

    fetchAgreements();
  }, [companyId]);

  return { agreements, loading, error, fetchAgreements };
};
