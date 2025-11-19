// src/hooks/useStudents.ts
import { useState, useEffect } from "react";
import { studentApi } from "../api/studentApi";
import type { IStudent } from "@/models/IStudent";

export const useStudents = (initialSkip = 0, initialTake = 10) => {
  const [students, setStudents] = useState<IStudent[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(Math.floor(initialSkip / initialTake) + 1);
  const [pageSize, setPageSize] = useState(initialTake);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Obtener estudiantes paginados */
  const fetchStudents = async (skip = 0, take = pageSize): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const data = await studentApi.getStudents(skip, take);
      setStudents(data.data);
      setTotal(data.total);
      setPage(data.page);
      setPageSize(data.pageSize);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /** Cambiar página */
  const setPageNumber = (newPage: number) => {
    const skip = (newPage - 1) * pageSize;
    fetchStudents(skip, pageSize);
  };

  /** Cambiar tamaño de página */
  const setPageSizeNumber = (newPageSize: number) => {
    setPageSize(newPageSize);
    fetchStudents(0, newPageSize); // reiniciar en primera página
  };

  /** Soft delete */
    const deactivate = async (id: number): Promise<IStudent | undefined> => {
      setLoading(true);
      setError(null);
      try {
        const data = await studentApi.deactivateStudent(id);
        fetchStudents();
        return data;
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    };
  
    /** Reactivar */
    const reactivate = async (id: number): Promise<IStudent | undefined> => {
      setLoading(true);
      setError(null);
      try {
        const data = await studentApi.reactivateStudent(id);
        fetchStudents();
        return data;
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    };

    const cargarMasivo = async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const result = await studentApi.cargarMasivo(file);

      // refrescar lista después del cargue
      await fetchStudents();

      return result; // por si quieres mostrar los detalles
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents(initialSkip, initialTake);
  }, []);

  return {
    students,
    total,
    page,
    pageSize,
    loading,
    error,
    deactivate,
    reactivate,
    fetchStudents,
    setPageNumber,
    setPageSizeNumber,
    cargarMasivo
  };
};
