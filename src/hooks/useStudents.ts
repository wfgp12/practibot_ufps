import type { IStudent } from "@/models/IStudent";
import { useState, useCallback } from "react";

export const useStudents = () => {
  const [students, setStudents] = useState<IStudent[]>([
    {
      id: "1",
      code: "1152101",
      firstName: "Juan",
      lastName: "Perez",
      institutionalEmail: "juan.perez@gmail.com",
      identificationNumber: "123456789",
      isActive: true,
    },
    {
      id: "2",
      code: "1152001",
      firstName: "Maria",
      lastName: "Gomez",
      institutionalEmail: "maria.gomez@gmail.com",
      identificationNumber: "987654321",
      isActive: true,
    },
  ]);

  // ➕ Agregar estudiante
  const addStudent = useCallback((newStudent: IStudent) => {
    setStudents((prev) => [...prev, newStudent]);
  }, []);

  // ✏️ Editar estudiante
  const updateStudent = useCallback((id: string, updatedData: Partial<IStudent>) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === id ? { ...student, ...updatedData } : student
      )
    );
  }, []);

  // 🗑️ Eliminar estudiante
  const deleteStudent = useCallback((id: string) => {
    setStudents((prev) => prev.filter((student) => student.id !== id));
  }, []);

  // 🔍 Buscar estudiante (por código, nombre, etc.)
  const searchStudents = useCallback((query: string) => {
    return students.filter(
      (s) =>
        s.firstName.toLowerCase().includes(query.toLowerCase()) ||
        s.lastName.toLowerCase().includes(query.toLowerCase()) ||
        s.code.includes(query)
    );
  }, [students]);

  return {
    students,
    addStudent,
    updateStudent,
    deleteStudent,
    searchStudents,
  };
};
