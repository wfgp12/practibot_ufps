import { useEffect, useState } from "react";
import type { ResumenReportes } from "@/api/reportsApi";
import reportsApi from "@/api/reportsApi";
import { ReportesResumen } from "./ReportesResumen ";

export const ReportesResumenContainer = () => {
  const [resumen, setResumen] = useState<ResumenReportes | null>(null);

  useEffect(() => {
    const fetchResumen = async () => {
      try {
        const data = await reportsApi.obtenerResumen();
        setResumen(data);
      } catch (error) {
        console.error("Error cargando el resumen de reportes:", error);
      }
    };

    fetchResumen();
  }, []);

  if (!resumen) return <p>Cargando...</p>;

  return <ReportesResumen {...resumen} />;
};
