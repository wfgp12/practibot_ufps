import { useState, useEffect } from "react";
import { studentApi } from "../api/studentApi";
import { mapStudentToApiPayload, type IStudent } from "@/models/IStudent";

export const useStudent = (id?: number | null) => {
  const [student, setStudent] = useState<IStudent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudent = async (): Promise<void> => {
    if (id === null) return;

    setLoading(true);
    setError(null);
    try {
      let data: IStudent;

      if (typeof id === "number") {
        data = await studentApi.getStudentById(id);
      } else {
        data = await studentApi.getMyProfile();
      }

      setStudent(data);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createStudent = async (payload: { nombre: string; email: string }): Promise<IStudent | undefined> => {
    setLoading(true);
    setError(null);
    try {
      const data = await studentApi.createStudent(payload);
      setStudent(data);
      return data;
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      throw err;
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
      
      const data = await studentApi.completeProfile(student.id, mapStudentToApiPayload(payload));
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
    if (id !== null) fetchStudent();
  }, [id]);

  return { student, loading, error, fetchStudent, createStudent, updateStudent, completeProfile, deactivate, reactivate };
};
