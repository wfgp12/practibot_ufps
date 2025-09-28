import type { Vacancy } from "@/models/IVacancy"
import { useState } from "react"


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
        },
        {
            id: "2",
            title: "Desarrollador Backend",
            modality: "Remoto",
            company: "Tech Solutions",
            location: "Bogotá",
            workday: "Tiempo completo",
            skills: ["Node.js", "PostgreSQL", "Docker"],
        },
        {
            id: "3",
            title: "Desarrollador Fullstack",
            modality: "Híbrido",
            company: "GlobalSoft",
            location: "Medellín",
            workday: "Medio tiempo",
            skills: ["React", "Node.js", "MongoDB"],
        },
        {
            id: "4",
            title: "UI/UX Designer",
            modality: "Presencial",
            company: "Creative Studio",
            location: "Cali",
            workday: "Tiempo completo",
            skills: ["Figma", "Adobe XD"],
        },
        {
            id: "5",
            title: "Mobile Developer",
            modality: "Remoto",
            company: "AppMasters",
            location: "Remoto",
            workday: "Freelance",
            skills: ["React Native", "Expo"],
        },
        {
            id: "6",
            title: "DevOps Engineer",
            modality: "Híbrido",
            company: "CloudOps",
            location: "Barranquilla",
            workday: "Tiempo completo",
            skills: ["AWS", "Kubernetes", "Terraform"],
        },
    ])
    return { vacancies, setVacancies }
}
