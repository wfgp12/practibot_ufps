import { Button } from "@/components";
import { Table, type Column } from "@/components/Table";
import { TabsSection, type TabItem } from "@/components/TabsSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CargarMasivoModal } from "@/components/CargueMasivoModal";

import type { Agreement } from "@/models/IAgreement";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router";
import { useAgreements } from "@/hooks/useAgreements";
import { format } from "date-fns";
import { AgreementModal } from "./agreement/AgreementModal";

export const GestionConvenios = () => {
    const navigate = useNavigate();
    const {
        agreements, total, page, pageSize,
        pendingAgreements, totalPending, pagePending, pageSizePending,
        fetchAgreements,
        uploadMassiveAgreements,
        setFilters,
        setPage,
        setPendingFilters,
        setPagePending,
        // loading, error
    } = useAgreements();

    const columnasConvenios: Column<Agreement>[] = [
        { key: "name", title: "Nombre", filterType: "text" },
        {
            key: "type", title: "Tipo", filterType: "select", filterOptions: [
                { label: "Macro", value: "Macro" },
                { label: "Específico", value: "Específico" },
            ]
        },
        { key: "company", title: "Empresa", render: (_, agreement) => agreement.company?.nombre || "N/A", filterType: "text" },
        {
            key: "startDate",
            title: "Fecha Inicio",
            render: (value) => {
                if (!value) return "—";
                return format(new Date(String(value)), "dd-MM-yyyy");
            },
            filterType: "date"
        },
        {
            key: "endDate",
            title: "Fecha Fin",
            render: (value) => {
                if (!value) return "—";
                return format(new Date(String(value)), "dd-MM-yyyy");
            },
            filterType: "date"
        },
        {
            key: "status", title: "Estado",
            filterType: "select",
            filterOptions: [
                { label: "Pendiente de firma", value: "Pendiente de firma" },
                { label: "Pendiente de revisión", value: "Pendiente de revisión" },
                { label: "En revisión", value: "En revisión" },
                { label: "Aprobado", value: "Aprobado" },
                { label: "Rechazado", value: "Rechazado" },
                { label: "Vencido", value: "Vencido" },
            ],
            render: (estado) => (
                <Badge
                    variant="outline"
                    className={`
                        ${estado === "Aprobado" ? "border-green-500 text-green-500" : ""}
                        ${estado === "Pendiente de firma" ? "border-e-yellow-400-500 text-yellow-400-500" : ""}
                        ${estado === "Pendiente de revisión" ? "border-e-yellow-400-500 text-yellow-400-500" : ""}
                        ${estado === "En revisión" ? "border-e-yellow-400-500 text-yellow-400-500" : ""}
                        ${estado === "Rechazado" ? "border-red-500 text-red-500" : ""}
                        ${estado === "Vencido" ? "border-red-500 text-red-500" : ""}
                    `}
                >
                    {String(estado)}
                </Badge>
            )
        },
        {
            key: "id",
            title: "Acciones",
            align: "center",
            render: (_, company) => (
                <div className="space-x-2">
                    <Button onClick={() => navigate(`/dashboard/agreement/${company.id}`)} className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white" variant="outline">Ver Convenio</Button>
                </div>
            ),
        },
    ];

    const columnasSolicitudes: Column<Agreement>[] = [
        { key: "name", title: "Nombre", filterType: "text" },
        {
            key: "type", title: "Tipo", filterType: "select", filterOptions: [
                { label: "Macro", value: "Macro" },
                { label: "Específico", value: "Específico" },
            ]
        },
        { key: "company", title: "Empresa", render: (_, agreement) => agreement.company?.nombre || "N/A" },
        {
            key: "status", title: "Estado",
            filterType: "select",
            filterOptions: [
                { label: "Pendiente de firma", value: "Pendiente de firma" },
                { label: "Pendiente de revisión", value: "Pendiente de revisión" },
                { label: "En revisión", value: "En revisión" },
                { label: "Aprobado", value: "Aprobado" },
                { label: "Rechazado", value: "Rechazado" },
                { label: "Vencido", value: "Vencido" },
            ],
            render: (estado) => (
                <Badge
                    variant="outline"
                    className={`
                        ${estado === "Aprobado" ? "border-green-500 text-green-500" : ""}
                        ${estado === "Pendiente de firma" ? "border-e-yellow-400-500 text-yellow-400-500" : ""}
                        ${estado === "Pendiente de revisión" ? "border-e-yellow-400-500 text-yellow-400-500" : ""}
                        ${estado === "En revisión" ? "border-e-yellow-400-500 text-yellow-400-500" : ""}
                        ${estado === "Rechazado" ? "border-red-500 text-red-500" : ""}
                        ${estado === "Vencido" ? "border-red-500 text-red-500" : ""}
                    `}
                >
                    {String(estado)}
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
    ];;

    const tabs: TabItem[] = [
        {
            label: "Convenios",
            value: "convenios",
            content: (
                <>
                    <div className="flex justify-between items-center mb-4">
                        <h5 className="text-lg font-medium">Convenios de empresas</h5>
                        <div className="flex gap-2">
                            <CargarMasivoModal
                                title="Cargue Masivo de Convenios"
                                buttonLabel="Cargar convenios"
                                showPdfSection={true}
                                handleSubmit={async (excelFile, pdfFiles) => {
                                    await uploadMassiveAgreements(excelFile, pdfFiles);
                                }}
                             />
                            <AgreementModal onCreated={fetchAgreements} />
                        </div>
                    </div>

                    <Table
                        columns={columnasConvenios}
                        data={agreements}
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
                    {totalPending > 0 && (
                        <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {totalPending}
                        </span>
                    )}
                </div>
            ),
            value: "solicitudes",
            content: (
                <>
                    <h5 className="text-lg font-medium mb-4">
                        Solicitudes de convenio
                    </h5>
                    <Table
                        columns={columnasSolicitudes}
                        data={pendingAgreements}
                        total={totalPending}
                        page={pagePending}
                        pageSize={pageSizePending}
                        onChange={({ filters, page }) => {
                            setPendingFilters(filters);
                            setPagePending(page);
                        }}
                    />
                </>
            ),
        },
    ];

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Gestión de Convenios</CardTitle>
            </CardHeader>
            <CardContent>
                <TabsSection tabs={tabs} defaultValue="convenios" />
            </CardContent>
        </Card>
    );
};
