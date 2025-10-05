import { Button } from "@/components";
import { Table, type Column } from "@/components/Table";
import { TabsSection, type TabItem } from "@/components/TabsSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useConvenios } from "@/hooks/useAgreement";
import type { Convenio, Solicitud } from "@/models/ICompany";

export const GestionConvenios = () => {

    const { convenios, solicitudes } = useConvenios();
    const columnasConvenios: Column<Convenio>[] = [
        { key: "empresa", title: "Empresa" },
        { key: "nit", title: "NIT" },
        {
            key: "id",
            title: "Acciones",
            align: "center",
            render: () => (
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
                    >
                        Editar
                    </Button>
                    <Button variant="destructive">Eliminar</Button>
                </div>
            ),
        },
    ];

    const columnasSolicitudes: Column<Solicitud>[] = [
        { key: "empresa", title: "Empresa" },
        {
            key: "estado",
            title: "Estado",
            render: (value) => (
                <span className="text-yellow-600 font-medium">{value}</span>
            ),
        },
        {
            key: "id",
            title: "Acciones",
            align: "center",
            render: () => (
                <div className="space-x-2">
                    <Button className="bg-green-600 hover:bg-green-700">Admitir</Button>
                    <Button variant="destructive">Rechazar</Button>
                </div>
            ),
        },
    ];

    const tabs: TabItem[] = [
        {
            label: "Convenios Activos",
            value: "convenios",
            content: (
                <>
                    <div className="flex justify-between items-center mb-4">
                        <h5 className="text-lg font-medium">Empresas con convenio</h5>
                        <Button className="bg-green-600 hover:bg-green-700">
                            Crear nuevo convenio
                        </Button>
                    </div>

                    <Table columns={columnasConvenios} data={convenios} />
                </>
            ),
        },
        {
            label: (
                <div className="flex items-center gap-2">
                    Solicitudes
                    {solicitudes.length > 0 && (
                        <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {solicitudes.length}
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
                    <Table columns={columnasSolicitudes} data={solicitudes} />
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
