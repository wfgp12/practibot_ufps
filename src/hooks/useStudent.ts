import { useState, useEffect } from "react";
import { studentApi } from "../api/studentApi";
import type { IStudent } from "@/models/IStudent";

export const useStudent = (id?: number | null) => {
  const [student, setStudent] = useState<IStudent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Obtener estudiante por ID o "mi perfil" */
  const fetchStudent = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      let data: IStudent;
      if (id) {
        // Modo externo: obtiene estudiante por ID
        data = await studentApi.getStudentById(id);
      } else {
        // Modo "mi perfil": obtiene estudiante autenticado por token
        data = await studentApi.getMyProfile();
      }
      setStudent(data);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /** Actualizar estudiante */
  const updateStudent = async (payload: Partial<IStudent>): Promise<IStudent | undefined> => {
    if (!student) return;
    setLoading(true);
    setError(null);
    try {
      const data = await studentApi.updateStudent(student.id, payload);
      setStudent(data);
      return data;
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /** Completar perfil del estudiante */
  const completeProfile = async (payload: Partial<IStudent>): Promise<IStudent | undefined> => {
    if (!student) return;
    setLoading(true);
    setError(null);
    try {
      const data = await studentApi.completeProfile(student.id, payload);
      setStudent(data);
      return data;
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /** Soft delete */
  const deactivate = async (): Promise<IStudent | undefined> => {
    if (!student) return;
    setLoading(true);
    setError(null);
    try {
      const data = await studentApi.deactivateStudent(student.id);
      setStudent(data);
      return data;
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /** Reactivar */
  const reactivate = async (): Promise<IStudent | undefined> => {
    if (!student) return;
    setLoading(true);
    setError(null);
    try {
      const data = await studentApi.reactivateStudent(student.id);
      setStudent(data);
      return data;
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudent();
  }, [id]);

  return { student, loading, error, fetchStudent, updateStudent, completeProfile, deactivate, reactivate };
};
