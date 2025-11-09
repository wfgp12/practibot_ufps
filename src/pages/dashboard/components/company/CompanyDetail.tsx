import { useNavigate, useParams } from "react-router";
import { useEffect, useState, useCallback } from "react";
import { AlertTriangle, ArrowLeft, Building2, Hash, Mail, MapPin, Phone } from "lucide-react";

import { Badge, Button, Card, CardContent, SectionComponent, Table } from "@/components";
import { Skeleton } from "@/components/ui/skeleton";
import { CompanyModal } from "./CompanyModal";
import { useCompanies } from "@/hooks/useCompanies";
import { useAgreements } from "@/hooks/useAgreements";

import type { ICompany, IRegisterCompanyData } from "@/models/ICompany";
import { useAppSelector } from "@/store/hooks";

export const CompanyDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { user } = useAppSelector(state => state.auth);
    const {
        loading,
        fetchCompanyById,
        approveCompany,
        rejectCompany,
        toggleCompanyState,
        updateCompany
    } = useCompanies();
    const [company, setCompany] = useState<ICompany | null>(null);

    const { agreements, loading: loadingAgreements, error: errorAgreements } = useAgreements(id ? Number(id) : undefined);

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

    /** Handlers conectados al hook */
    const handleApprove = async () => {
        if (!company) return;
        await approveCompany(company.id);
        loadCompany();
    };

    const handleReject = async () => {
        if (!company) return;
        await rejectCompany(company.id);
        navigate(-1);
    };

    const handleToggleStatus = async () => {
        if (!company) return;
        const newEstado = company.estado === "APROBADA" ? "INACTIVA" : "APROBADA";
        await toggleCompanyState(company.id, newEstado);
        loadCompany();
    };

    const handleEdit = async (data: IRegisterCompanyData, id?: string) => {
        if (!id) return;
        const updated = await updateCompany(id, data);
        if (updated) setCompany(updated);
    }

    return (
        <>
            <SectionComponent classNameContent="max-w-4xl" classNameContainer="pt-0 pb-4">
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
                            {company.estado === "PENDIENTE" ? (userRole === "EMPRESA" && isOwner || userRole === "DIRECTOR") && (
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
                                            <Button className="bg-[#424242] text-white hover:bg-gray-700" onClick={handleToggleStatus}>
                                                {company.estado === "APROBADA" ? "Desactivar" : "Activar"}
                                            </Button>
                                            <CompanyModal
                                                company={company}
                                                onSubmit={handleEdit}
                                            />
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
                    <div className="flex items-center gap-2 text-gray-600">
                        <Mail size={18} /> {company.correo}
                    </div>

                    {company.descripcion && (
                        <div className="mt-4 border-t pt-4">
                            <h3 className="text-lg font-semibold mb-2">Descripción</h3>
                            <p className="text-gray-700">{company.descripcion}</p>
                        </div>
                    )}
                </Card>
            </SectionComponent>
            {/* Sección de convenios asociados a la empresa */}
            <SectionComponent classNameContainer="pt-2" classNameContent="max-w-4xl">
                <div className="flex flex-col w-full border-b-4 border-red-600 pb-2 mb-4">
                    <h2 className="text-xl text-gray-500 font-bold">Convenios</h2>

                </div>
                <Card className="w-full border border-border/60 shadow-sm">
                    <CardContent>
                        {loadingAgreements ? (
                            <p className="text-center text-gray-500 py-6">Cargando convenios...</p>
                        ) : errorAgreements ? (
                            <p className="text-center text-red-500 py-6">{errorAgreements}</p>
                        ) : agreements.length === 0 ? (
                            <div className="flex items-center justify-between border border-dashed border-amber-400/70 bg-amber-50/60 px-6 py-4 rounded-md">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center rounded-full bg-amber-100 p-2">
                                        <AlertTriangle className="h-5 w-5 text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">
                                            Esta empresa aún no tiene convenios registrados.
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Cuando la empresa inicie un proceso de convenio, aparecerá aquí.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Table
                                columns={[
                                    { key: "name", title: "Convenio" },
                                    {
                                        key: "status",
                                        title: "Estado",
                                        render: (estado) => (
                                            <Badge
                                                variant="outline"
                                                className={
                                                    estado === "Aprobado"
                                                        ? "border-green-500 text-green-600"
                                                        : estado === "En revisión"
                                                            ? "border-yellow-500 text-yellow-600"
                                                            : estado === "Rechazado"
                                                                ? "border-red-500 text-red-600"
                                                                : "border-gray-400 text-gray-600"
                                                }
                                            >
                                                {String(estado)}
                                            </Badge>
                                        ),
                                    },
                                    {
                                        key: "startDate",
                                        title: "Inicio",
                                        render: (v) => {
                                            const date = v as Date | string | null;
                                            return date ? new Date(date).toLocaleDateString("es-CO") : "—";
                                        },
                                    },
                                    {
                                        key: "endDate",
                                        title: "Fin",
                                        render: (v) => {
                                            const date = v as Date | string | null;
                                            return date ? new Date(date).toLocaleDateString("es-CO") : "—";
                                        },
                                    },
                                    {
                                        key: "id",
                                        title: "Acciones",
                                        align: "center",
                                        render: (_, convenio) => (
                                            <Button
                                                variant="outline"
                                                className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
                                                onClick={() => navigate(`/dashboard/agreement/${convenio.id}`)}
                                            >
                                                Ver detalle
                                            </Button>
                                        ),
                                    },
                                ]}
                                data={agreements}
                                total={agreements.length}
                                page={1}
                                pageSize={10}
                            />
                        )}
                    </CardContent>
                </Card>
            </SectionComponent>

        </>
    );
};
