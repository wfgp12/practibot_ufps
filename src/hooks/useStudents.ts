// src/hooks/useStudents.ts
import { useState, useEffect, useCallback } from "react";
import { studentApi } from "../api/studentApi";
import type { IStudent } from "@/models/IStudent";

export const useStudents = (vacancyId?: number) => {
  const [students, setStudents] = useState<IStudent[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<{
    nombre?: string;
    email?: string;
    codigo?: string;
    documento?: string;
  }>({});

  /** Obtener estudiantes paginados */
  const fetchStudents = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const skip = (page - 1) * pageSize;

      const data = (vacancyId)
        ? await studentApi.getStudentsForVacancy(vacancyId, {
          skip,
          take: pageSize,
          ...filters, 
        })
        : await studentApi.getStudents({
          skip,
          take: pageSize,
          ...filters, 
        });

      setStudents(data.data);
      setTotal(data.total);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, filters]);

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
    fetchStudents();
  }, [fetchStudents]);

  return {
    students,
    total,
    page,
    pageSize,
    loading,
    error,
    setFilters,
    deactivate,
    reactivate,
    fetchStudents,
    setPage,
    setPageSize,
    cargarMasivo
  };
};
