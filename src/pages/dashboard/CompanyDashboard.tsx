import { AlertTriangle, Building2, Factory, FileText, Mail, MapPin, Phone } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { Badge, Button, Table, type Column } from "@/components";
import { SectionComponent } from "@/components/SectionComponent";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ChangePasswordCard } from "@/components/ChangePasswordCard";
import { VacancyModal } from "./components/vancancy/VacancyModal";

import { useCompany } from "@/hooks/useCompany";
import { useVacancies } from "@/hooks/useVacancies";
import { useAgreements } from "@/hooks/useAgreement";

import type { Vacancy } from "@/models/IVacancy";
import type { Agreement } from "@/models/IAgreement";

export const CompanyDashboard = () => {
  const { company, loading, error } = useCompany();
  const navigate = useNavigate();

  const { companyVacancies, fetchCompanyVacancies, addVacancy } = useVacancies();
  const { agreements, loading: loadingAgreements } = useAgreements(Number(company?.id));


  const columnasVacantes: Column<Vacancy>[] = [
    { key: "title", title: "Título" },
    {
      key: "area",
      title: "Area",
      filterType: "text",
    },
    {
      key: "technicalSkills",
      title: "Habilidades Técnicas",
      filterType: "text",
      render: (skills) => {
        if (!Array.isArray(skills) || skills.length === 0) return "—";

        const visibleSkills = skills.slice(0, 3);
        const hasMore = skills.length > 3;

        return (
          <div className="flex flex-wrap gap-1">
            {visibleSkills.map((skill, index) => (
              <Badge key={index} variant="outline">
                {skill}
              </Badge>
            ))}
            {hasMore && (
              <Badge variant="secondary" className="opacity-70">
                ...
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      key: "status",
      align: "center",
      title: "Estado",
      filterType: "select",
      filterOptions: [
        { label: "Abierto", value: "Open" },
        { label: "Cerrado", value: "Closed" },
      ],
      render: (status) => (
        <Badge
          variant="outline"
          className={`
                        ${status === "Open" ? "border-green-500 text-green-500" : ""}
                        ${status === "Closed" ? "border-red-500 text-red-500" : ""}
                    `}
        >
          {status === "Open" ? "Abierto" : "Cerrado"}
        </Badge>
      ),
    },
    {
      key: "id",
      title: "Acciones",
      align: "center",
      render: (_value, record) => (
        <Button
          className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
          variant="outline"
          onClick={() => navigate(`/dashboard/vacancy/${record.id}`)}
        >
          Ver detalle
        </Button>
      ),
    },
  ];

  const columnasConvenios: Column<Agreement>[] = [
    { key: "name", title: "Nombre" },
    { key: "type", title: "Tipo" },
    {
      key: "status",
      title: "Estado",
      render: (status) => {
        const color =
          status === "Aprobado"
            ? "bg-green-100 text-green-700 border-green-300"
            : status === "En revisión"
              ? "bg-amber-100 text-amber-700 border-amber-300"
              : status === "Rechazado"
                ? "bg-red-100 text-red-700 border-red-300"
                : "bg-gray-100 text-gray-700 border-gray-300";

        return (
          <Badge variant="outline" className={`text-xs px-3 py-1 border ${color}`}>
            {String(status)}
          </Badge>
        );
      },
    },
    {
      key: "startDate",
      title: "Inicio",
      render: (date) =>
        date ? new Date(date).toLocaleDateString("es-CO") : "—",
    },
    {
      key: "endDate",
      title: "Fin",
      render: (date) =>
        date ? new Date(date).toLocaleDateString("es-CO") : "—",
    },
    {
      key: "id",
      title: "Acciones",
      align: "center",
      render: () => (
        <Button
          variant="outline"
          onClick={() => navigate(`/dashboard/agreement`)}
          className="border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white"
        >
          Ver detalle
        </Button>
      ),
    },
  ];

  const hasActiveOrInReview = agreements.some(
    (a) => a.status === "Aprobado" || a.status === "En revisión"
  );

  if (loading)
    return (
      <div className="flex justify-center items-center h-60">
        <p className="text-muted-foreground">Cargando información de la empresa...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-60">
        <p className="text-red-600 font-medium">Error: {error}</p>
      </div>
    );

  if (!company)
    return (
      <div className="flex justify-center items-center h-60">
        <p className="text-muted-foreground">No se encontró información de la empresa.</p>
      </div>
    );

  return (
    <div>
      {!company.isEnabled && !hasActiveOrInReview && (
        <div className="max-w-6xl mx-auto mb-6 flex items-center justify-between rounded-lg border border-dashed border-amber-400/70 bg-amber-50/60 px-6 py-4 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center rounded-full bg-amber-100 p-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">
                No cuentas con un convenio activo
              </p>
              <p className="text-xs text-gray-500">
                Solicita tu convenio para habilitar la publicación y seguimiento de vacantes.
              </p>
            </div>
          </div>

          <Button
            onClick={() => navigate("/dashboard/agreement")}
            className="bg-amber-500 hover:bg-amber-600 text-white h-8 px-4 text-sm rounded-md"
          >
            Solicitar convenio
          </Button>
        </div>
      )}

      <SectionComponent classNameContainer="py-6" classNameContent="max-w-6xl">
        <Card className="border border-border/60 shadow-md hover:shadow-lg transition-all duration-200 w-full">
          <CardHeader className="flex flex-col gap-1">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Building2 className="w-6 h-6 text-primary" />
              {company.nombre}
            </CardTitle>
            <CardDescription>Información general de la empresa</CardDescription>
          </CardHeader>

          <Separator />

          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">{company.direccion}</span>
            </div>

            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <span>{company.correo}</span>
            </div>

            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-muted-foreground" />
              <span>{company.telefono}</span>
            </div>

            <div className="flex items-center gap-2">
              <Factory className="w-5 h-5 text-muted-foreground" />
              <span>{company.sector}</span>
            </div>

            <div className="col-span-1 sm:col-span-2 flex items-center justify-between">
              <p className="text-gray-600">
                <strong>NIT:</strong> {company.nit}
              </p>
            </div>

            {company.descripcion && (
              <div className="sm:col-span-2 text-muted-foreground text-sm mt-2 leading-relaxed">
                {company.descripcion}
              </div>
            )}
          </CardContent>
        </Card>
      </SectionComponent>

      <SectionComponent classNameContainer="py-6" classNameContent="max-w-6xl" id="change-password">
        <ChangePasswordCard />
      </SectionComponent>

      {hasActiveOrInReview && (
        <SectionComponent classNameContainer="py-10" classNameContent="max-w-6xl" id="convenios">
          <Card className="w-full">
            <CardHeader className="flex flex-col gap-1">
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <FileText className="w-6 h-6 text-primary" />
                Convenios
              </CardTitle>
              <CardDescription>Historial de convenios registrados con la universidad</CardDescription>
            </CardHeader>

            <CardContent>
              {loadingAgreements ? (
                <p className="text-center text-muted-foreground py-4">
                  Cargando convenios...
                </p>
              ) : agreements.length === 0 ? (
                <p className="text-center text-sm text-gray-500 py-4">
                  Aún no existen convenios registrados.
                </p>
              ) : (
                <Table
                  columns={columnasConvenios}
                  data={agreements}
                  page={1}
                  total={agreements.length}
                  pageSize={10}
                />
              )}
            </CardContent>
          </Card>
        </SectionComponent>
      )
      }

      {company.isEnabled && (
        <SectionComponent classNameContainer="py-10" classNameContent="max-w-6xl" id="vacantes">
          <Card className="w-full">
            <CardHeader className="flex flex-col gap-1">
              <div className="w-full flex flex-row items-center justify-between ">
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  Vacantes
                </CardTitle>
                <VacancyModal onSubmit={async (data) => {
                  try {
                    await addVacancy(data);
                    toast.success("Vacante enviada a revisión");
                  } catch (error) {
                    console.error(error);
                    toast.error("Error al enviar la vacante");
                  }
                }} />
              </div>
            </CardHeader>
            <CardContent>
              <Table
                columns={columnasVacantes}
                data={companyVacancies.data}
                page={companyVacancies.page}
                total={companyVacancies.total}
                pageSize={companyVacancies.pageSize}
                onChange={({ filters, page }) => fetchCompanyVacancies({ filters, page })}
              />
            </CardContent>
          </Card>
        </SectionComponent>
      )}
    </div >
  );
};
