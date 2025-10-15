import { useNavigate, useParams } from "react-router";
import { useEffect, useState, useCallback } from "react";
import { ArrowLeft, Briefcase, Building2, Clock, MapPin, Wrench } from "lucide-react";

import { Badge, Button, Card, SectionComponent } from "@/components";
import type { Vacancy } from "@/models/IVacancy";
import { useVacancies } from "@/hooks/useVacancies";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppSelector } from "@/store/hooks";

export const VacancyDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const {
        approveVacancy,
        rejectVacancy,
        // toggleVacancyStatus,
        fetchVacancyById,
        loading
    } = useVacancies();

    const [vacancy, setVacancy] = useState<Vacancy | null>(null);
    const { user } = useAppSelector(state => state.auth);
    const userRole = user?.role || "guest";
    const isOwner = vacancy?.company === user?.name;

    // 🔄 Obtener vacante por ID
    const loadVacancy = useCallback(async () => {
        if (!id) return;
        const vac = await fetchVacancyById(id);
        setVacancy(vac);
    }, [id, fetchVacancyById]);

    useEffect(() => {
        loadVacancy();
    }, [loadVacancy]);

    if (loading || !vacancy) {
        return (
            <SectionComponent classNameContent="max-w-4xl" classNameContainer="pt-0">
                <div className="w-full mb-4">
                    <Skeleton className="h-10 w-32 rounded" />
                </div>

                <Card className="w-full p-6 space-y-4">
                    <div className="flex items-start justify-between">
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-64 rounded" />
                            <Skeleton className="h-4 w-40 rounded" />
                        </div>
                        <div className="flex gap-2">
                            <Skeleton className="h-10 w-24 rounded" />
                            <Skeleton className="h-10 w-24 rounded" />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                        <Skeleton className="h-6 w-20 rounded" />
                        <Skeleton className="h-6 w-20 rounded" />
                        <Skeleton className="h-6 w-20 rounded" />
                    </div>

                    <div className="mt-4 space-y-2">
                        <Skeleton className="h-6 w-40 rounded" />
                        <div className="flex flex-wrap gap-2">
                            <Skeleton className="h-6 w-16 rounded" />
                            <Skeleton className="h-6 w-16 rounded" />
                            <Skeleton className="h-6 w-16 rounded" />
                        </div>
                    </div>

                    <div className="mt-6 border-t pt-4 space-y-2">
                        <Skeleton className="h-6 w-48 rounded" />
                        <Skeleton className="h-4 w-full rounded" />
                        <Skeleton className="h-4 w-full rounded" />
                    </div>
                </Card>
            </SectionComponent>
        );
    }

    const handleApprove = async () => {
        await approveVacancy(vacancy.id);
        navigate("/dashboard");
    };

    const handleReject = async () => {
        await rejectVacancy(vacancy.id);
        navigate("/dashboard");
    };

    // const handleToggleStatus = async () => {
    //     await toggleVacancyStatus(vacancy.id);
    //     loadVacancy(); // refresca los datos después de actualizar el estado
    // };

    return (
        <SectionComponent classNameContent="max-w-4xl" classNameContainer="pt-0" id="vacantes">
            <div className="w-full mb-4">
                <button
                    className="flex items-center gap-2 text-gray-400 px-4 py-2 rounded duration-200 hover:gap-3 transition-all hover:bg-[#e4e2e2] hover:scale-105 hover:-translate-x-1"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft size={24} /> Volver
                </button>
            </div>

            <Card className="w-full p-6 space-y-4">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{vacancy.title}</h2>
                        <div className="flex items-center gap-2 mt-1 text-gray-600">
                            <Building2 size={18} />
                            <span className="font-medium">{vacancy.company}</span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {vacancy.status === "Pending" ? (userRole === "EMPRESA" && isOwner || userRole === "DIRECTOR") && (
                            <>
                                <Button className="bg-[#AA1916] text-white hover:bg-red-800" onClick={handleApprove}>
                                    Aprobar
                                </Button>
                                <Button className="bg-[#424242] text-white hover:bg-gray-700" variant="destructive" onClick={handleReject}>
                                    Rechazar
                                </Button>
                            </>
                        ) : (
                            <>
                                {userRole === "ESTUDIANTE" && (
                                    <Button className="bg-[#AA1916] text-white hover:bg-red-800">
                                        Aplicar
                                    </Button>
                                )}

                                {(userRole === "EMPRESA" && isOwner) || userRole === "DIRECTOR" ? (
                                    <>
                                        {/* <Button className="bg-[#424242] text-white hover:bg-gray-700" onClick={handleToggleStatus}>
                                            {vacancy.status === "Open" ? "Desactivar" : "Activar"}
                                        </Button>
                                        <Button className="bg-white text-[#AA1916] border border-[#AA1916] hover:bg-[#AA1916] hover:text-white" onClick={() => console.log("Editar vacante")}>
                                            Editar
                                        </Button> */}
                                    </>
                                ) : null}
                            </>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                    <Badge variant="secondary" className="flex items-center gap-1">
                        <Briefcase size={18} /> {vacancy.modality}
                    </Badge>
                    <Badge variant="secondary" className="flex items-center gap-1">
                        <Clock size={18} /> {vacancy.workday}
                    </Badge>
                    <Badge variant="secondary" className="flex items-center gap-1">
                        <MapPin size={18} /> {vacancy.location}
                    </Badge>
                </div>

                <div className="mt-4">
                    <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1">
                        <Wrench size={16} /> Habilidades requeridas
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {vacancy.skills.map((skill) => (
                            <Badge key={skill} variant="outline" className="text-sm">
                                {skill}
                            </Badge>
                        ))}
                    </div>
                </div>

                {vacancy.description && (
                    <div className="mt-6 border-t pt-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Descripción del cargo
                        </h3>
                        <p className="text-gray-700 leading-relaxed">{vacancy.description}</p>
                    </div>
                )}
            </Card>
        </SectionComponent>
    );
};
