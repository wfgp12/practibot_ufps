import { useNavigate, useParams } from "react-router";
import { useEffect, useState, useCallback } from "react";
import { ArrowLeft, Briefcase, Building2, Clock, MapPin, Wrench } from "lucide-react";

import { Badge, Button, Card, SectionComponent } from "@/components";
import { Skeleton } from "@/components/ui/skeleton";
import { useVacancies } from "@/hooks/useVacancies";
import { VacancyModal } from "./VacancyModal";
import { useAppSelector } from "@/store/hooks";

import { mapVacancyToFormRegisterVacancy, type Vacancy } from "@/models/IVacancy";
import { PostulationApi, type Postulation } from "@/api/postulationApi";
import { toast } from "sonner";
import { VacancyDetailPostulations } from "./VacancyDetailPOstulation";

export const VacancyDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const {
        approveVacancy,
        rejectVacancy,
        toggleVacancyStatus,
        fetchVacancyById,
        updateVacancy,
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

    const [hasActivePostulation, setHasActivePostulation] = useState(false);

    // 🔄 Revisar si el estudiante ya aplicó
    const checkPostulations = useCallback(async () => {
        if (!id) return;
        try {
            const postulaciones = await PostulationApi.getMine();
            const exists = postulaciones.data.some(
                (p: Postulation) =>
                    p.vacanteId === Number(id) &&
                    (p.estado === "EN_REVISION" || p.estado === "ACEPTADA")
            );
            setHasActivePostulation(exists);
        } catch (error) {
            console.error(error);
        }
    }, [id]);

    useEffect(() => {
        checkPostulations();
    }, [checkPostulations]);

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

    const handleToggleStatus = async () => {
        await toggleVacancyStatus(vacancy);
        loadVacancy();
    };

    const handleApply = async () => {
        if (!vacancy) return;

        try {
            await PostulationApi.create({ vacanteId: Number(id) });
            toast.success("¡Te postulaste correctamente!");
            navigate("/dashboard");
        } catch (error) {
            console.error(error);
            toast.error(`Error al postularse`);
        }
    };

    return (
        <>
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
                                    {userRole === "ESTUDIANTE" && !hasActivePostulation && (
                                        <Button onClick={handleApply} className="bg-[#AA1916] text-white hover:bg-red-800 cursor-pointer">
                                            Aplicar
                                        </Button>
                                    )}

                                    {(userRole === "EMPRESA" && isOwner) || userRole === "DIRECTOR" ? (
                                        <>
                                            <Button className="bg-[#424242] text-white hover:bg-gray-700" onClick={handleToggleStatus}>
                                                {vacancy.status === "Open" ? "Desactivar" : "Activar"}
                                            </Button>
                                            <VacancyModal
                                                vacancy={mapVacancyToFormRegisterVacancy(vacancy, Number(id))}
                                                onSubmit={async (data, vacancyId) => {
                                                    await updateVacancy(data, vacancyId!);
                                                    await loadVacancy();
                                                }}
                                            />
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Habilidades Blandas */}
                            {vacancy.softSkills && vacancy.softSkills.length > 0 && (
                                <div className="gap-4 ml-5">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-1">Habilidades blandas</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {vacancy.softSkills.map((skill) => (
                                            <Badge key={skill} variant="outline" className="text-sm">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Habilidades Técnicas */}
                            {vacancy.technicalSkills && vacancy.technicalSkills.length > 0 && (
                                <div className="gap-4 ml-5">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-1">Habilidades técnicas</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {vacancy.technicalSkills.map((skill) => (
                                            <Badge key={skill} variant="outline" className="text-sm">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    {vacancy.description && (
                        <div className="mt-2 border-t pt-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Descripción del cargo
                            </h3>
                            <p className="text-gray-700 leading-relaxed">{vacancy.description}</p>
                        </div>
                    )}
                </Card>
            </SectionComponent>
            {(userRole === "DIRECTOR" || userRole === "ADMIN" || userRole === "EMPRESA") && (
                <VacancyDetailPostulations vacancyId={Number(vacancy.id)} userRole={userRole} />
            )}
        </>
    );
};
