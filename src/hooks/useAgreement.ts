import type { ICompany } from "@/models/ICompany";
import { useState, useCallback } from "react";


export function useConvenios() {
  // --- Estados principales ---
  const [convenios, setConvenios] = useState<ICompany[]>([
    {
      id: "1",
      nombre: "Tecnologías XYZ",
      nit: "900123456-7",
      correo: "tecnolog@xyz.com",
      direccion: "Calle 123",
      sector: "Tecnología",
      descripcion: "Estamos en la fase de diseño de una nueva solución para nuestros clientes.",
      telefono: "123456789",
      estado: "APROBADA",
      userId: "1",
    },
  ]);

  const [solicitudes, setSolicitudes] = useState<ICompany[]>([
    {
      id: "1",
      nombre: "Servicios IT Cúcuta",
      nit: "900123456-7",
      direccion: "Calle 123",
      sector: "Tecnología",
      descripcion: "Estamos en la fase de diseño de una nueva solución para nuestros clientes.",
      telefono: "123456789",
      correo: "servicios@xyz.com",
      estado: "PENDIENTE",
      userId: "1",
    },
    {
      id: "2",
      nombre: "DataSoft S.A.",
      nit: "900123456-7",
      direccion: "Calle 123",
      sector: "Tecnología",
      descripcion: "Estamos en la fase de diseño de una nueva solución para nuestros clientes.",
      telefono: "123456789",
      correo: "datasoft@xyz.com",
      estado: "PENDIENTE",
      userId: "1",
    },
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

  const crearConvenio = useCallback((nuevo: ICompany) => {
    setConvenios((prev) => [...prev, { ...nuevo, id: Date.now().toString() }]);
  }, []);

  const eliminarConvenio = useCallback((id: string) => {
    setConvenios((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const admitirSolicitud = useCallback((id: string) => {
    setSolicitudes((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, estado: "Aprobada" } : s
      )
    );
  }, []);

  const rechazarSolicitud = useCallback((id: string) => {
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
