import { Users, Briefcase, FileText, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { JSX } from "react";

interface ReporteCardProps {
  title: string;
  count: number;
  icon: JSX.Element;
  color?: string;
}

const ReporteCard = ({ title, count, icon, color = "text-red-700" }: ReporteCardProps) => (
  <Card className="shadow-sm rounded-xl">
    <CardHeader className="flex items-center gap-4">
      <div className={`p-2 rounded-lg bg-red-100 ${color} flex items-center justify-center`}>
        {icon}
      </div>
      <CardTitle className="text-sm text-gray-600">{title}</CardTitle>
    </CardHeader>
    <CardContent className="text-center">
      <p className={`text-3xl font-bold ${color}`}>{count}</p>
    </CardContent>
  </Card>
);

export const ReportesResumen = ({
  estudiantesEnPractica,
  vacantesActivas,
  conveniosVigentes,
  conveniosPorVencer
}: {
  estudiantesEnPractica: number;
  vacantesActivas: number;
  conveniosVigentes: number;
  conveniosPorVencer: number;
}) => {
  return (
    <section id="reportes" className="bg-white shadow rounded-2xl p-6 mt-6 w-full">
      <h2 className="text-xl font-bold mb-4">Reportes rápidos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <ReporteCard
          title="Estudiantes en prácticas"
          count={estudiantesEnPractica}
          icon={<Users className="w-6 h-6" />}
          color="text-green-600"
        />
        <ReporteCard
          title="Vacantes activas"
          count={vacantesActivas}
          icon={<Briefcase className="w-6 h-6" />}
          color="text-blue-600"
        />
        <ReporteCard
          title="Convenios vigentes"
          count={conveniosVigentes}
          icon={<CheckCircle className="w-6 h-6" />}
          color="text-purple-600"
        />
        <ReporteCard
          title="Convenios próximos a vencer"
          count={conveniosPorVencer}
          icon={<FileText className="w-6 h-6" />}
          color="text-yellow-600"
        />
      </div>
    </section>
  );
};
