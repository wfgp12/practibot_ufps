import { Badge, Button } from "@/components";
import { Table, type Column } from "@/components/Table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useStudents } from "@/hooks/useStudents";
import type { IStudent } from "@/models/IStudent";
import { StudentModal } from "./student/StudentModal";

export const GestionEstudiantes = () => {
    const {
        students,
        total,
        page,
        pageSize,
        loading,
        error,
        deactivate,
        reactivate,
        fetchStudents,
        setPageNumber,
    } = useStudents();


    const columns: Column<IStudent>[] = [
        { key: "name", title: "Nombre" },
        { key: "email", title: "Correo institucional" },
        {
            key: "active",
            title: "Estado",
            render: (active) => (
                <Badge variant="outline" className={`${active ? "border-green-500 text-green-500" : "border-red-500 text-red-500"}`}>
                    {active ? "Activo" : "Inactivo"}
                </Badge>
            ),
        },
        {
            key: "id",
            title: "Acciones",
            render: (id, student) => (
                <div className="flex  space-x-2">
                    <Button
                        variant="outline"
                        className={`${student.active ?"text-red-600 border-red-600 hover:bg-red-600": "text-zinc-600 border-zinc-600 hover:bg-zinc-600"} hover:text-white`}
                        onClick={() => student.active ? deactivate(Number(id)) : reactivate(Number(id))}
                    >
                        {student.active ? "Desactivar" : "Activar"}
                    </Button>
                    <StudentModal student={student} onSuccess={() => fetchStudents()} />
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
                    <h5 className="text-lg font-medium">Listado de estudiantes</h5>
                    <StudentModal onSuccess={fetchStudents} />
                </div>

                <Table
                    columns={columns}
                    data={students}
                    total={total}
                    page={page}
                    pageSize={pageSize}
                    loading={loading}
                    onChange={({ page }) => setPageNumber(page)}
                />

                {error && (
                    <p className="text-red-600 text-center py-2">{error}</p>
                )}
            </CardContent>
        </Card>
    );
};
