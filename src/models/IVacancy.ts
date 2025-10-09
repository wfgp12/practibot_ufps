export interface Vacancy {
    id: string
    title: string
    modality: string
    company: string
    location: string
    workday: string
    skills: string[]
    description?: string
    status: "Open" | "Closed" | "Pending"
}