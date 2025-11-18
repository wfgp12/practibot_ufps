import { Button } from "@/components";
import { Table, type Column } from "@/components/Table";
import { TabsSection, type TabItem } from "@/components/TabsSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CompanyModal } from "./company/CompanyModal";

import { useCompanies } from "@/hooks/useCompanies";
import type { ICompany } from "@/models/ICompany";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router";

export const GestionEmpresas = () => {
    const navigate = useNavigate();
    const { 
        companies, page, total, pageSize,
        pendingCompanies, pendingPage, pendingTotal,pendingPageSize,
        setPage, setFilters, setPendingPage, setPendingFilters,
        createCompany, 
    } = useCompanies();
    const columnasConvenios: Column<ICompany>[] = [
        { key: "nombre", title: "Empresa", filterType: "text" },
        { key: "nit", title: "NIT", filterType: "text" },
        { key: "sector", title: "Sector" },
        { key: "correo", title: "Correo", filterType: "text" },
        { key: "telefono", title: "Teléfono" },
        {
            key: "estado", title: "Estado",
            filterType: "select",
            filterOptions: [
                { label: "Aprobada", value: "APROBADA" },
                { label: "Inactiva", value: "INACTIVA" },
                { label: "Rechazada", value: "RECHAZADA" },
            ],
            render: (estado) => (
                <Badge
                    variant="outline"
                    className={`
                        ${estado === "APROBADA" ? "border-green-500 text-green-500" : ""}
                        ${estado === "INACTIVA" ? "border-red-500 text-red-500" : ""}
                    `}
                >
                    {estado as string}
                </Badge>
            )
        },
        {
            key: "id",
            title: "Acciones",
            align: "center",
            render: (_, company) => (
                <div className="space-x-2">
                    <Button onClick={() => navigate(`/dashboard/company/${company.id}`)} className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white" variant="outline">Ver a detalles</Button>
                </div>
            ),
        },
    ];

    const columnasSolicitudes: Column<ICompany>[] = [
        { key: "nombre", title: "Empresa" },
        { key: "nit", title: "NIT" },
        { key: "sector", title: "Sector" },
        { key: "correo", title: "Correo" },
        { key: "telefono", title: "Teléfono" },
        {
            key: "id",
            title: "Acciones",
            align: "center",
            render: (_, company) => (
                <div className="space-x-2">
                    <Button onClick={() => navigate(`/dashboard/company/${company.id}`)} className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white" variant="outline">Ver a detalles</Button>
                </div>
            ),
        },
    ];

    const tabs: TabItem[] = [
        {
            label: "Convenios",
            value: "convenios",
            content: (
                <>
                    <div className="flex justify-between items-center mb-4">
                        <h5 className="text-lg font-medium">Empresas con convenio</h5>
                        <CompanyModal onSubmit={createCompany} />
                    </div>

                    <Table
                        columns={columnasConvenios}
                        data={companies}
                        total={total}
                        page={page}
                        pageSize={pageSize}                        
                        onChange={({ filters, page }) => {
                            setFilters(filters);
                            setPage(page);
                        }} 
                    
                    />
                </>
            ),
        },
        {
            label: (
                <div className="flex items-center gap-2">
                    Solicitudes
                    {pendingTotal > 0 && (
                        <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {pendingTotal}
                        </span>
                    )}
                </div>
            ),
            value: "solicitudes",
            content: (
                <>
                    <h5 className="text-lg font-medium mb-4">
                        Solicitudes Empresas
                    </h5>
                    <Table 
                        columns={columnasSolicitudes} 
                        data={pendingCompanies} 
                        total={pendingTotal}
                        page={pendingPage}
                        pageSize={pendingPageSize}
                        onChange={({ filters, page }) => {
                            setPendingFilters(filters);
                            setPendingPage(page);
                        }}
                    />
                </>
            ),
        },
    ];

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Gestión de Empresas</CardTitle>
            </CardHeader>
            <CardContent>
                <TabsSection tabs={tabs} defaultValue="convenios" />
            </CardContent>
        </Card>
    );
};
