import { useEffect } from "react";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Table, type Column } from "@/components/Table";
import { useVacancies } from "@/hooks/useVacancies";
import type { Vacancy } from "@/models/IVacancy";
import { useNavigate } from "react-router";
import { Badge } from "@/components";

export const VacanciesList = () => {
  const { vacancies, fetchVacancies, loading } = useVacancies();
  const navigate = useNavigate();

  // Cargar vacantes iniciales
  useEffect(() => {
    fetchVacancies({ page: 1, pageSize: 10 });
  }, [fetchVacancies]);

  // 🧱 Columnas de la tabla
  const columns: Column<Vacancy>[] = [
    {
      key: "title",
      title: "Título",
    },
    {
      key: "area",
      title: "Área",
    },
    {
      key: "modality",
      title: "Modalidad",
    },
    {
      key: "company",
      title: "Empresa",
    },
    {
      key: "technicalSkills",
      title: "Habilidades Técnicas",
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
      key: "id",
      title: "Acciones",
      align: "right",
      render: (_, record) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/dashboard/vacancy/${record.id}`)}
          className="flex items-center gap-1"
        >
          <Eye className="w-4 h-4" />
          Ver
        </Button>
      ),
    },
  ];

  // 🧩 Paginación / filtrado
  const handleTableChange = ({
    filters,
    page,
    pageSize,
  }: {
    filters: Record<string, string>;
    page: number;
    pageSize: number;
  }) => {
    fetchVacancies({ filters, page, pageSize });
  };

  return (
    <Card className="border border-zinc-200 shadow-sm w-full">
      <CardHeader>
        <h2 className="text-lg font-semibold text-zinc-800">
          Vacantes disponibles
        </h2>
      </CardHeader>

      <CardContent>
        <Table<Vacancy>
          columns={columns}
          data={vacancies.data}
          total={vacancies.total}
          page={vacancies.page}
          pageSize={vacancies.pageSize}
          loading={loading}
          onChange={handleTableChange}
        />
      </CardContent>
    </Card>
  );
};
