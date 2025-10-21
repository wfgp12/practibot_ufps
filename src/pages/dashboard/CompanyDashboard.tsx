import { Building2, Factory, Mail, MapPin, Phone } from "lucide-react";

import { SectionComponent } from "@/components/SectionComponent";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCompany } from "@/hooks/useCompany";
import { CreateVacancyCard } from "./components/CreateVacancyCard ";
import { ChangePasswordCard } from "@/components/ChangePasswordCard";
import { Badge, Button, Table, type Column } from "@/components";
import type { Vacancy } from "@/models/IVacancy";
import { useNavigate } from "react-router";
import { useVacancies } from "@/hooks/useVacancies";

export const CompanyDashboard = () => {
  const { company, loading, error } = useCompany();
  const navigate = useNavigate();

  const { companyVacancies, fetchCompanyVacancies } = useVacancies();

  const columnasVacantes: Column<Vacancy>[] = [
    { key: "title", title: "Título" },
    {
      key: "area",
      title: "Area",
      filterType: "text",
    },
    {
      key: "skills",
      title: "Habilidades",
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
      <SectionComponent classNameContainer="py-5" classNameContent="max-w-6xl">
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

      <SectionComponent classNameContainer="py-10" classNameContent="max-w-6xl" id="change-password">
        <ChangePasswordCard />
      </SectionComponent>

      <SectionComponent classNameContainer="py-10" classNameContent="max-w-6xl" id="vacantes">
        <CreateVacancyCard />
      </SectionComponent>

      <SectionComponent classNameContainer="py-10" classNameContent="max-w-6xl" id="vacantes">
        <Card className="w-full">
          <CardHeader className="flex flex-col gap-1">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              Vacantes
            </CardTitle>
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
    </div>
  );
};
