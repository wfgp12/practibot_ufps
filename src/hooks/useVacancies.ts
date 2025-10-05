import { useState } from "react";
import type { Vacancy } from "@/models/IVacancy";

export const useVacancies = () => {
    const [vacancies, setVacancies] = useState<Vacancy[]>([
        {
            id: "1",
            title: "Desarrollador Frontend",
            modality: "Presencial",
            company: "UFPS Empresas",
            location: "Cúcuta",
            workday: "Práctica",
            skills: ["React", "Tailwind", "TypeScript"],
            status: "Open",
        },
        {
            id: "2",
            title: "Desarrollador Backend",
            modality: "Remoto",
            company: "Tech Solutions",
            location: "Bogotá",
            workday: "Tiempo completo",
            skills: ["Node.js", "PostgreSQL", "Docker"],
            status: "Open",
        },
        {
            id: "3",
            title: "Desarrollador Fullstack",
            modality: "Híbrido",
            company: "GlobalSoft",
            location: "Medellín",
            workday: "Medio tiempo",
            skills: ["React", "Node.js", "MongoDB"],
            status: "Open",
        },
        {
            id: "4",
            title: "UI/UX Designer",
            modality: "Presencial",
            company: "Creative Studio",
            location: "Cali",
            workday: "Tiempo completo",
            skills: ["Figma", "Adobe XD"],
            status: "Open",
        },
        {
            id: "5",
            title: "Mobile Developer",
            modality: "Remoto",
            company: "AppMasters",
            location: "Remoto",
            workday: "Freelance",
            skills: ["React Native", "Expo"],
            status: "Open",
        },
        {
            id: "6",
            title: "DevOps Engineer",
            modality: "Híbrido",
            company: "CloudOps",
            location: "Barranquilla",
            workday: "Tiempo completo",
            skills: ["AWS", "Kubernetes", "Terraform"],
            status: "Open",
        },
    ]);

    const [pendingVacancies, setPendingVacancies] = useState<Vacancy[]>([
        {
            id: "3",
            title: "Fullstack Developer",
            modality: "Híbrido",
            company: "GlobalSoft",
            location: "Medellín",
            workday: "Medio tiempo",
            skills: ["React", "Node.js", "MongoDB"],
            status: "Pending",
        },
        {
            id: "4",
            title: "UI/UX Designer",
            modality: "Presencial",
            company: "Creative Studio",
            location: "Cali",
            workday: "Tiempo completo",
            skills: ["Figma", "Adobe XD"],
            status: "Pending",
        },
    ]);
    /** 🟢 Aprobar vacante pendiente → mover a aprobadas */
    const approveVacancy = (id: string) => {
        setPendingVacancies((prev) => {
            const vacancy = prev.find((v) => v.id === id);
            if (!vacancy) return prev;
            setVacancies((vPrev) => [...vPrev, { ...vacancy, status: "Open" }]);
            return prev.filter((v) => v.id !== id);
        });
    };

    /** 🔴 Rechazar vacante pendiente → eliminar */
    const rejectVacancy = (id: string) => {
        setPendingVacancies((prev) => prev.filter((v) => v.id !== id));
    };

    /** ✏️ Alternar estado de publicación (Open/Closed) */
    const toggleVacancyStatus = (id: string) => {
        setVacancies((prev) =>
            prev.map((v) =>
                v.id === id
                    ? { ...v, status: v.status === "Open" ? "Closed" : "Open" }
                    : v
            )
        );
    };

    /** ➕ Agregar una nueva vacante → se guarda como pendiente */
    const addVacancy = (newVacancy: Omit<Vacancy, "id" | "status">) => {
        const nextId = (vacancies.length + pendingVacancies.length + 1).toString();
        setPendingVacancies((prev) => [
            ...prev,
            { id: nextId, ...newVacancy, status: "Pending" },
        ]);
    };

    /** 🗑️ Eliminar una vacante aprobada */
    const removeVacancy = (id: string) => {
        setVacancies((prev) => prev.filter((v) => v.id !== id));
    };

    return {
        vacancies,           // Vacantes aprobadas
        pendingVacancies,    // Vacantes en espera
        addVacancy,
        approveVacancy,
        rejectVacancy,
        removeVacancy,
        toggleVacancyStatus,
    };

};
