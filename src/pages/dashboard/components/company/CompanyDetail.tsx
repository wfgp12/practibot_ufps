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
import { AgreementModal } from "../agreement/AgreementModal";

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

    const {
        agreements,
        total,
        page,
        pageSize,
        loading: loadingAgreements,
        setPage,
        setPageSize,
        setFilters,
        fetchAgreements
    } = useAgreements(id ? Number(id) : undefined);

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

    const handleEdit = async (data: IRegisterCompanyData, id?: number) => {
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
                                                {company.estado === "APROBADA" || company.estado === "HABILITADA" ? "Desactivar" : "Activar"}
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
                        <div className="mt-4 border-t-4 border-red-500 pt-4">
                            <h3 className="text-lg font-semibold mb-2">Descripción</h3>
                            <p className="text-gray-700">{company.descripcion}</p>
                        </div>
                    )}

                    {company.representanteLegal && (
                        <div className="mt-6 border-t-4 border-red-500  pt-6">
                            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
                                <Badge className="bg-[#AA1916] text-white px-2 py-1 rounded">RL</Badge>
                                Representante Legal
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                {/* Nombre */}
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-full bg-gray-100">
                                        <Building2 size={20} className="text-gray-700" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Nombre</p>
                                        <p className="text-base font-medium text-gray-800">
                                            {company.representanteLegal.nombre}
                                        </p>
                                    </div>
                                </div>

                                {/* Tipo documento */}
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-full bg-gray-100">
                                        <Hash size={20} className="text-gray-700" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Tipo documento</p>
                                        <p className="text-base font-medium text-gray-800">
                                            {company.representanteLegal.tipoDocumento}
                                        </p>
                                    </div>
                                </div>

                                {/* Número documento */}
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-full bg-gray-100">
                                        <Hash size={20} className="text-gray-700" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">No. Documento</p>
                                        <p className="text-base font-medium text-gray-800">
                                            {company.representanteLegal.numeroDocumento}
                                        </p>
                                    </div>
                                </div>

                                {/* Teléfono */}
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-full bg-gray-100">
                                        <Phone size={20} className="text-gray-700" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Teléfono</p>
                                        <p className="text-base font-medium text-gray-800">
                                            {company.representanteLegal.telefono}
                                        </p>
                                    </div>
                                </div>

                                {/* Correo */}
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-full bg-gray-100">
                                        <Mail size={20} className="text-gray-700" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Correo</p>
                                        <p className="text-base font-medium text-gray-800 break-words">
                                            {company.representanteLegal.correo}
                                        </p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}

                </Card>
            </SectionComponent>
            {/* Sección de convenios asociados a la empresa */}
            {company.estado === "APROBADA" || company.estado === "INACTIVA" || company.estado === "HABILITADA" ? (
                <SectionComponent classNameContainer="pt-2" classNameContent="max-w-4xl">
                    <div className="flex items-center w-full justify-between border-b-4 border-red-600 pb-2 mb-4">
                        <h2 className="text-xl text-gray-500 font-bold">Convenios</h2>
                        {(userRole === "DIRECTOR" || userRole === "ADMIN") && (
                            <AgreementModal empresaId={Number(company.id)} onCreated={fetchAgreements} />
                        )}
                    </div>
                    <Card className="w-full border border-border/60 shadow-sm">
                        <CardContent>
                            {agreements.length === 0 ? (
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
                                        { key: "name", title: "Convenio", filterType: "text" },
                                        {
                                            key: "status",
                                            title: "Estado",
                                            filterType: "select",
                                            filterOptions: [
                                                { label: "Aprobado", value: "APROBADO" },
                                                { label: "En revisión", value: "EN_REVISION" },
                                                { label: "Rechazado", value: "RECHAZADO" },
                                            ],
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
                                    total={total}
                                    page={page}
                                    pageSize={pageSize}
                                    loading={loadingAgreements}
                                    onChange={({ filters, page, pageSize }) => {
                                        setFilters(filters);
                                        setPage(page);
                                        setPageSize(pageSize);
                                    }}
                                />
                            )}
                        </CardContent>
                    </Card>
                </SectionComponent>
            ) : null}
        </>
    );
};
