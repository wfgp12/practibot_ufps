import { useNavigate, useParams } from "react-router";
import { useEffect, useState, useCallback } from "react";
import { ArrowLeft, Building2, Hash, MapPin, Phone } from "lucide-react";

import { Button, Card, SectionComponent } from "@/components";
import type { ICompany } from "@/models/ICompany";
import { useCompanies } from "@/hooks/useCompanies";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppSelector } from "@/store/hooks";

export const CompanyDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { fetchCompanyById, loading } = useCompanies();
    const [company, setCompany] = useState<ICompany | null>(null);
    const { user } = useAppSelector(state => state.auth);

    const isOwner = company?.userId === user?.id;
    const userRole = user?.role || "guest";

    const loadCompany = useCallback(async () => {
        if (!id) return;
        const data = await fetchCompanyById(id);
        setCompany(data);
    }, [id, fetchCompanyById]);

    useEffect(() => {
        loadCompany();
    }, [loadCompany]);

    if (loading || !company) {
        return (
            <SectionComponent classNameContent="max-w-4xl" classNameContainer="pt-0">
                <Skeleton className="h-10 w-32 rounded mb-4" />
                <Card className="w-full p-6 space-y-4">
                    <Skeleton className="h-8 w-64 rounded" />
                    <Skeleton className="h-4 w-40 rounded" />
                    <Skeleton className="h-6 w-20 rounded mt-2" />
                    <Skeleton className="h-6 w-32 rounded mt-2" />
                </Card>
            </SectionComponent>
        );
    }

    const handleApprove = () => {
        console.log("Aprobar empresa");
    }

    const handleReject = () => {
        console.log("Rechazar empresa");
    }

    const handleToggleStatus = () => {
        console.log("Activar/Desactivar empresa");
    }

    return (
        <SectionComponent classNameContent="max-w-4xl" classNameContainer="pt-0">
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
                        <h2 className="text-2xl font-bold text-gray-900">{company.nombre}</h2>
                        <div className="flex flex-row items-center gap-2">

                            <div className="flex items-center gap-2 mt-1 text-gray-400">
                                <Building2 size={18} />
                                <span className="font-medium">{company.sector}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400 mt-1">
                                <Hash size={18} />
                                <span className="font-medium">{company.nit}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {company.estado === "Pending" && (userRole === "EMPRESA" && isOwner || userRole === "DIRECTOR") && (
                            <>
                                <Button className="bg-green-600 hover:bg-green-700" onClick={handleApprove}>
                                    Aprobar
                                </Button>
                                <Button variant="destructive" onClick={handleReject}>
                                    Rechazar
                                </Button>
                            </>
                        )}

                        {company.estado === "Open" && (
                            <>
                                {userRole === "ESTUDIANTE" && (
                                    <Button className="bg-blue-600 hover:bg-blue-700">
                                        Aplicar
                                    </Button>
                                )}

                                {(userRole === "EMPRESA" && isOwner) || userRole === "DIRECTOR" ? (
                                    <>
                                        <Button onClick={handleToggleStatus}>
                                            {company.estado === "Open" ? "Desactivar" : "Activar"}
                                        </Button>
                                        <Button onClick={() => console.log("Editar empresa")}>
                                            Editar
                                        </Button>
                                    </>
                                ) : null}
                            </>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={18} /> {company.direccion}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                    <Phone size={18} /> {company.telefono}
                </div>

                {company.descripcion && (
                    <div className="mt-4 border-t pt-4">
                        <h3 className="text-lg font-semibold mb-2">Descripción</h3>
                        <p className="text-gray-700">{company.descripcion}</p>
                    </div>
                )}

                {(userRole === "DIRECTOR" || (userRole === "EMPRESA" && isOwner)) && (
                    <div className="mt-4 flex gap-2">
                        <Button onClick={() => navigate(`/companies/edit/${company.id}`)}>
                            Editar
                        </Button>
                        {/* Aquí podrías agregar botones de aprobar/rechazar si aplica */}
                    </div>
                )}
            </Card>
        </SectionComponent>
    );
};
