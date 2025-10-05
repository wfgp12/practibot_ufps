import { useEffect, useState } from "react";

export interface Report {
  label: string;
  value: number;
}

export const useReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async () => {
    try {
      setLoading(true);
      // 🔹 Simulación temporal (mock)
      // Aquí iría tu llamada real al endpoint con fetch o axios
      const response = await new Promise<Report[]>((resolve) =>
        setTimeout(
          () =>
            resolve([
              { label: "Empresas activas", value: 12 },
              { label: "Solicitudes de convenio", value: 5 },
              { label: "Vacantes publicadas", value: 28 },
              { label: "Estudiantes en prácticas", value: 45 },
            ]),
          800
        )
      );
      setReports(response);
    } catch (err: unknown) {
        console.error(err)
      setError("Error al cargar los reportes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return { reports, loading, error, refresh: fetchReports };
};
