import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { Badge, Button, Card, SectionComponent } from "@/components";
import type { Vacancy } from "@/models/IVacancy";
import { ArrowLeft, Briefcase, Building2, Clock, MapPin, Wrench } from "lucide-react";
import { useVacancies } from "@/hooks/useVacancies";

export const VacancyDetail = () => {
    const navigate = useNavigate();

    const { id } = useParams<{ id: string }>();
    const { pendingVacancies, approveVacancy, rejectVacancy, loading } = useVacancies();
    const [vacancy, setVacancy] = useState<Vacancy | null>(null);

    // Filtrar la vacante pendiente correspondiente
    useEffect(() => {
        if (pendingVacancies.length > 0) {
            const found = pendingVacancies.find((v) => v.id === id);
            setVacancy(found || null);
        }
    }, [id, pendingVacancies]);


    if (loading || !vacancy) return <div>Cargando...</div>;

    const handleApprove = async () => {
        await approveVacancy(vacancy.id);
        navigate("/dashboard"); // <-- navegar al dashboard después de aprobar
    };

    const handleReject = async () => {
        await rejectVacancy(vacancy.id);
        navigate("/dashboard"); // <-- navegar al dashboard después de rechazar
    };
    return (
        <SectionComponent classNameContent="max-w-4xl" id="vacantes">
            <>
                <div className="w-full">
                    <button className="flex items-center gap-2 text-gray-400 px-4 py-2 rounded  duration-200 hover:gap-3 transition-all hover:bg-[#e4e2e2] hover:scale-105 hover:-translate-x-1 " onClick={() => navigate(-1)}>
                        <ArrowLeft size={24} /> Volver
                    </button>
                </div>
                <Card className="w-full p-6 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{vacancy.title}</h2>
                            <div className="flex items-center gap-2 mt-1 text-gray-600">
                                <Building2 size={18} />
                                <span className="font-medium">{vacancy.company}</span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                className="bg-green-600 hover:bg-green-700"
                                onClick={handleApprove}
                            >
                                Aprobar
                            </Button>
                            <Button variant="destructive" onClick={handleReject}>
                                Rechazar
                            </Button>
                        </div>
                    </div>

                    {/* Badges de info */}
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

                    {/* Sección de habilidades */}
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

                    {/* Descripción */}
                    {vacancy.description && (
                        <div className="mt-6 border-t pt-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Descripción del cargo
                            </h3>
                            <p className="text-gray-700 leading-relaxed">{vacancy.description}</p>
                        </div>
                    )}
                </Card>
            </>
        </SectionComponent>
    );
};
