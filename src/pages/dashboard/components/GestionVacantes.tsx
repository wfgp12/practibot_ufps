import { Button } from "@/components";
import { Table, type Column } from "@/components/Table";
import { TabsSection, type TabItem } from "@/components/TabsSection";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useVacancies } from "@/hooks/useVacancies";
import type { Vacancy } from "@/models/IVacancy";
import { useNavigate } from "react-router";
import { VacancyModal } from "./vancancy/VacancyModal";

export const GestionVacantes = () => {
    const { vacancies, pendingVacancies, registerVacancy, fetchVacancies, fetchPendingVacancies } = useVacancies();
    const navigate = useNavigate();

    const columnasVacantes: Column<Vacancy>[] = [
        { key: "title", title: "Título" },
        { key: "company", title: "Empresa", filterType: "text" },
        {
            key: "area",
            title: "Area",
            filterType: "text",
        },
        {
            key: "technicalSkills",
            title: "Habilidades Técnicas",
            filterType: "text",
            render: (skills) => {
                if (!Array.isArray(skills) || skills.length === 0) return "—";

                const visibleSkills = skills.slice(0, 3);
                const hasMore = skills.length > 3;

                return (
                    <div className="flex flex-wrap gap-1">
                        {visibleSkills.map((skill, index) => (
                            <Badge key={index} variant="outline">
                                {skill}
                            </Badge>
                        ))}
                        {hasMore && (
                            <Badge variant="secondary" className="opacity-70">
                                ...
                            </Badge>
                        )}
                    </div>
                );
            },
        },
        {
            key: "status",
            align: "center",
            title: "Estado",
            filterType: "select",
            filterOptions: [
                { label: "Abierto", value: "Open" },
                { label: "Cerrado", value: "Closed" },
            ],
            render: (status) => (
                <Badge
                    variant="outline"
                    className={`
                        ${status === "Open" ? "border-green-500 text-green-500" : ""}
                        ${status === "Closed" ? "border-red-500 text-red-500" : ""}
                    `}
                >
                    {status === "Open" ? "Abierto" : "Cerrado"}
                </Badge>
            ),
        },
        {
            key: "id",
            title: "Acciones",
            align: "center",
            render: (_value, record) => (
                <Button
                    className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                    variant="outline"
                    onClick={() => navigate(`/dashboard/vacancy/${record.id}`)}
                >
                    Ver detalle
                </Button>
            ),
        },
    ];

    const columnasSolicitudes: Column<Vacancy>[] = [
        { key: "company", title: "Empresa" },
        { key: "title", title: "Título" },
        {
            key: "technicalSkills",
            title: "Habilidades Técnicas",
            render: (skills) => {
                if (!Array.isArray(skills) || skills.length === 0) return "—";

                const visibleSkills = skills.slice(0, 3);
                const hasMore = skills.length > 3;

                return (
                    <div className="flex flex-wrap gap-1">
                        {visibleSkills.map((skill, index) => (
                            <Badge key={index} variant="outline">
                                {skill}
                            </Badge>
                        ))}
                        {hasMore && (
                            <Badge variant="secondary" className="opacity-70">
                                ...
                            </Badge>
                        )}
                    </div>
                );
            },
        },

        {
            key: "id",
            title: "Acciones",
            align: "center",
            render: (_value, record) => (
                <div className="space-x-2">
                    <Button
                        className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                        variant="outline"
                        onClick={() => navigate(`/dashboard/vacancy/${record.id}`)}
                    >
                        Ver detalle
                    </Button>
                </div>
            ),
        },
    ];

    const tabs: TabItem[] = [
        {
            label: "Vacantes",
            value: "vacantes",
            content: (
                <>
                    <div className="flex justify-between items-center mb-4">
                        <h5 className="text-lg font-medium">Vacantes</h5>
                        <VacancyModal onSubmit={registerVacancy} />
                    </div>

                    <Table 
                        columns={columnasVacantes} 
                        data={vacancies.data} 
                        page={vacancies.page} 
                        total={vacancies.total}
                        pageSize={vacancies.pageSize} 
                        onChange={({ filters, page }) => fetchVacancies({ filters, page })}
                    />
                </>
            ),
        },
        {
            label: (
                <div className="flex items-center gap-2">
                    Solicitudes
                    {pendingVacancies.total > 0 && (
                        <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {pendingVacancies.total}
                        </span>
                    )}
                </div>
            ),
            value: "solicitudes",
            content: (
                <>
                    <h5 className="text-lg font-medium mb-4">
                        Solicitudes de vacantes
                    </h5>
                    <Table 
                        columns={columnasSolicitudes} 
                        data={pendingVacancies.data} 
                        page={pendingVacancies.page} 
                        total={pendingVacancies.total}
                        pageSize={pendingVacancies.pageSize} 
                        onChange={({ filters, page }) => fetchPendingVacancies({ filters, page })}
                    />
                </>
            ),
        },
    ];

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Gestión de Vacantes</CardTitle>
            </CardHeader>
            <CardContent>
                <TabsSection tabs={tabs} defaultValue="vacantes" />
            </CardContent>
        </Card>
    );
};
