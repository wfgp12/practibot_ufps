import { Building2, Factory, Mail, MapPin, Phone } from "lucide-react";

import { SectionComponent } from "@/components/SectionComponent";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCompany } from "@/hooks/useCompany";
import { CreateVacancyCard } from "./components/CreateVacancyCard ";

export const CompanyDashboard = () => {
  const { company, loading, error } = useCompany();

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

      <SectionComponent classNameContainer="py-10" classNameContent="max-w-6xl" id="vacantes">
        <CreateVacancyCard />
      </SectionComponent>
    </div>
  );
};
