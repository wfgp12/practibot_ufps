import type { Convenio, Solicitud } from "@/models/ICompany";
import { useState, useCallback } from "react";


export function useConvenios() {
  // --- Estados principales ---
  const [convenios, setConvenios] = useState<Convenio[]>([
    { id: 1, empresa: "Tecnologías XYZ", nit: "900123456-7" },
  ]);

  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([
    { id: 1, empresa: "Servicios IT Cúcuta", estado: "Pendiente" },
    { id: 2, empresa: "DataSoft S.A.", estado: "Pendiente" },
  ]);

  const [loading, setLoading] = useState(false);

  // --- Acciones: luego se reemplazan por peticiones reales ---
  const fetchConvenios = useCallback(async () => {
    setLoading(true);
    try {
      // Aquí harías una petición con fetch o axios
      // Ejemplo:
      // const res = await axios.get("/api/convenios");
      // setConvenios(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSolicitudes = useCallback(async () => {
    setLoading(true);
    try {
      // const res = await axios.get("/api/solicitudes");
      // setSolicitudes(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  const crearConvenio = useCallback((nuevo: Convenio) => {
    setConvenios((prev) => [...prev, { ...nuevo, id: Date.now() }]);
  }, []);

  const eliminarConvenio = useCallback((id: number) => {
    setConvenios((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const admitirSolicitud = useCallback((id: number) => {
    setSolicitudes((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, estado: "Aprobada" } : s
      )
    );
  }, []);

  const rechazarSolicitud = useCallback((id: number) => {
    setSolicitudes((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, estado: "Rechazada" } : s
      )
    );
  }, []);

  return {
    convenios,
    solicitudes,
    loading,
    fetchConvenios,
    fetchSolicitudes,
    crearConvenio,
    eliminarConvenio,
    admitirSolicitud,
    rechazarSolicitud,
  };
}
