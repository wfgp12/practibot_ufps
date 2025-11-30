import { Table } from "@/components"; // ajusta según donde tengas tu Table
import { Card, CardContent, SectionComponent, Badge } from "@/components";
import { useEffect, useState, useCallback } from "react";
import { PostulationApi, type Postulation } from "@/api/postulationApi";
import { AssignStudentsModal } from "./AssignStudentModal";

export const VacancyDetailPostulations = ({ vacancyId, userRole }: { vacancyId: number; userRole: string }) => {
    const [postulations, setPostulations] = useState<Postulation[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchPostulations = useCallback(async () => {
        setLoading(true);
        try {
            const res = await PostulationApi.getByVacancy(vacancyId);
            setPostulations(res.data); // ajusta según tu API
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [vacancyId]);

    useEffect(() => {
        if (userRole === "DIRECTOR" || userRole === "ADMIN" || userRole === "EMPRESA") {
            fetchPostulations();
        }
    }, [userRole, fetchPostulations]);

    if (userRole !== "DIRECTOR" && userRole !== "ADMIN" && userRole !== "EMPRESA") return null;

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
                    {postulations.length === 0 ? (
                        <div className="flex items-center justify-between border border-dashed border-amber-400/70 bg-amber-50/60 px-6 py-4 rounded-md">
                            <p className="text-sm text-gray-500">No hay postulaciones registradas para esta vacante.</p>
                        </div>
                    ) : (
                        <Table<Postulation>
                            columns={[
                                {
                                    key: "estudianteId",
                                    title: "Código",
                                    // filterType: "text",
                                    render: (_, p) => p.estudiante?.codigo || "—",
                                },
                                {
                                    key: "estudianteId",
                                    title: "Estudiante",
                                    // filterType: "text",
                                    render: (_, p) => p.estudiante?.usuario?.nombre || "—",
                                },
                                {
                                    key: "estado",
                                    title: "Estado",
                                    // filterType: "select",
                                    filterOptions: [
                                        { label: "En revisión", value: "EN_REVISION" },
                                        { label: "Aceptada", value: "ACEPTADA" },
                                        { label: "Rechazada", value: "RECHAZADA" },
                                        { label: "Cancelada", value: "CANCELADA" },
                                    ],
                                    render: (_, p) => {
                                        const estado = p.estado;
                                        return (
                                            <Badge
                                                variant="outline"
                                                className={
                                                    estado === "EN_REVISION"
                                                        ? "border-yellow-500 text-yellow-600"
                                                        : estado === "ACEPTADA"
                                                            ? "border-green-500 text-green-600"
                                                            : estado === "RECHAZADA"
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
                                    key: "fechaPostula",
                                    title: "Fecha",
                                    render: (_, p) => (p.fechaPostula ? new Date(p.fechaPostula).toLocaleDateString("es-CO") : "—"),
                                },
                                // {
                                //     key: "id",
                                //     title: "Acciones",
                                //     align: "center",
                                //     render: (_, postulation) => (
                                //         <Button
                                //             variant="outline"
                                //             className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                                //             onClick={async () => {
                                //                 try {
                                //                     await PostulationApi.cancel(postulation.id);
                                //                     fetchPostulations();
                                //                 } catch (error) {
                                //                     console.error(error);
                                //                 }
                                //             }}
                                //         >
                                //             Cancelar
                                //         </Button>
                                //     ),
                                // },
                            ]}
                            data={postulations}
                            total={postulations.length}
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
