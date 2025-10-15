import { Button } from "@/components";
import { Table, type Column } from "@/components/Table";
import { TabsSection, type TabItem } from "@/components/TabsSection";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useVacancies } from "@/hooks/useVacancies";
import type { Vacancy } from "@/models/IVacancy";
import { useNavigate } from "react-router";

export const GestionVacantes = () => {
    const { vacancies, pendingVacancies } = useVacancies();
    const navigate = useNavigate();

    const columnasVacantes: Column<Vacancy>[] = [
        { key: "title", title: "Título" },
        { key: "company", title: "Empresa" },
        {
            key: "skills",
            title: "Habilidades",
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
            render: (_value ,record) => (
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
            key: "skills",
            title: "Habilidades",
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
            render: (_value ,record) => (
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
                        {/* <Button className="bg-green-600 hover:bg-green-700">
                            Crear nuevo convenio
                        </Button> */}
                    </div>

                    <Table columns={columnasVacantes} data={vacancies} />
                </>
            ),
        },
        {
            label: (
                <div className="flex items-center gap-2">
                    Solicitudes
                    {pendingVacancies.length > 0 && (
                        <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {pendingVacancies.length}
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
                    <Table columns={columnasSolicitudes} data={pendingVacancies} />
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
