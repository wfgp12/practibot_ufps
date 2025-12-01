import { Button, Table, type Column } from "@/components"; // ajusta según donde tengas tu Table
import { Card, CardContent, SectionComponent, Badge } from "@/components";
import { AssignStudentsModal } from "./AssignStudentModal";
import { usePostulations } from "@/hooks/usePostulations";
import type { IPostulation } from "@/models/IPostulation";
import { useNavigate } from "react-router";

export const VacancyDetailPostulations = ({ vacancyId, userRole }: { vacancyId: number; userRole: string }) => {

    const {postulaciones, loading, fetchPostulations} = usePostulations(vacancyId);
    const navigate = useNavigate();

    if (userRole !== "DIRECTOR" && userRole !== "ADMIN" && userRole !== "EMPRESA") return null;

    if (userRole !== "DIRECTOR" && userRole !== "ADMIN" && userRole !== "EMPRESA") return null;

    const columns: Column<IPostulation>[] = [
        {
            key: "studentId",
            title: "Código",
            render: (_, p) => p.student?.code || "—",
        },
        {
            key: "student",
            title: "Estudiante",
            render: (_, p) => p.student?.name || "—",
        },
        {
            key: "status",
            title: "Estado",
            filterOptions: [
                { label: "En revisión", value: "EN_REVISION" },
                { label: "Aceptada", value: "ACEPTADA" },
                { label: "Rechazada", value: "RECHAZADA" },
                { label: "Cancelada", value: "CANCELADA" },
            ],
            render: (_, p) => {
                const estado = p.status;
                return (
                    <Badge
                        variant="outline"
                        className={
                            estado === "IN_REVIEW"
                                ? "border-yellow-500 text-yellow-600"
                                : estado === "ACCEPTED"
                                    ? "border-green-500 text-green-600"
                                    : estado === "REJECTED"
                                        ? "border-red-500 text-red-600"
                                        : "border-gray-400 text-gray-600"
                        }
                    >
                        {String(estado)}
                    </Badge>
                );
            },
        },
        {
            key: "createdAt",
            title: "Fecha",
            render: (_, p) => (p.createdAt ? new Date(p.createdAt).toLocaleDateString("es-CO") : "—"),
        },
    ];

    if (userRole === "EMPRESA") {
        columns.push({
            key: "id",
            title: "Acciones",
            render: (_value, record) => (
                <Button
                    className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                    variant="outline"
                    onClick={() => navigate(`/dashboard/student/${record.student?.id}?postulation=${record.id}`)}
                >
                    Ver postulación
                </Button>
            ),
        });
    }

    return (
        <SectionComponent classNameContainer="pt-2" classNameContent="max-w-4xl">
            <div className="flex items-center w-full justify-between border-b-4 border-red-600 pb-2 mb-4">
                <h2 className="text-xl text-gray-500 font-bold">Postulaciones</h2>
                {userRole === "DIRECTOR" || userRole === "ADMIN" ? (
                    <AssignStudentsModal
                        vacancyId={vacancyId}
                        onAssigned={fetchPostulations}
                    />
                ) : null}
            </div>

            <Card className="w-full border border-border/60 shadow-sm">
                <CardContent>
                    {postulaciones.length === 0 ? (
                        <div className="flex items-center justify-between border border-dashed border-amber-400/70 bg-amber-50/60 px-6 py-4 rounded-md">
                            <p className="text-sm text-gray-500">No hay postulaciones registradas para esta vacante.</p>
                        </div>
                    ) : (
                        <Table<IPostulation>
                            columns={columns}
                            data={postulaciones}
                            total={postulaciones.length}
                            page={1}
                            pageSize={10}
                            loading={loading}
                        />
                    )}
                </CardContent>
            </Card>
        </SectionComponent>
    );
};
