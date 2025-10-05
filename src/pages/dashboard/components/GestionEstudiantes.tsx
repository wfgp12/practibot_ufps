import { Button } from "@/components"
import { Table, type Column } from "@/components/Table"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useStudents } from "@/hooks/useStudents";
import type { IStudent } from "@/models/IStudent";

export const GestionEstudiantes = () => {

    const { students } = useStudents();

    const columnasConvenios: Column<IStudent>[] = [
        { key: "code", title: "Código" },
        { key: "firstName", title: "Nombre" },
        { key: "lastName", title: "Apellido" },
        { key: "institutionalEmail", title: "Email" },
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
                    <Button variant="destructive">Desactivar</Button>
                </div>
            ),
        },
    ];
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Gestión de Estudiantes</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex justify-between items-center mb-4">
                    <h5 className="text-lg font-medium">Estudiantes</h5>
                    <Button className="bg-green-600 hover:bg-green-700">
                        Agregar estudiante
                    </Button>
                </div>

                <Table columns={columnasConvenios} data={students} />

            </CardContent>
        </Card>
    )
}
