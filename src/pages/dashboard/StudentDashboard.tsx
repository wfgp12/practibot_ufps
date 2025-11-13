import { Badge, Button, Card, CardContent, CardHeader, SectionComponent, Table, type Column } from "@/components"
import { ProfileCard } from "./components/student/ProfileCard"
import { VacanciesList } from "./components/vancancy/VacanciesList"
import { PostulationApi, type Postulation } from "@/api/postulationApi"
import { useEffect, useState } from "react"

export const StudentDashboard = () => {
  const [postulations, setPostulations] = useState<Postulation[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  const fetchPostulations = async (p: number = 1) => {
    setLoading(true);
    try {
      const res = await PostulationApi.getMine(undefined, p, pageSize);
      setPostulations(res.data);
      setTotal(res.total);
      setPage(res.page);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: number) => {
    if (!confirm("¿Seguro quieres cancelar esta postulación?")) return;
    try {
      await PostulationApi.cancel(id);
      fetchPostulations(page); // refrescar tabla
    } catch (err) {
      console.error(err);
      alert("Error al cancelar la postulación");
    }
  };

  useEffect(() => {
    fetchPostulations();
  }, []);

  const columns: Column<Postulation>[] = [
    { key: "id", title: "ID", align: "center" },
    {
      key: "vacante",
      title: "Vacante",
      render: (_, record) => record.vacante?.titulo,
    },
    {
      key: "vacanteId",
      title: "Empresa",
      render: (_, record) => record.vacante?.empresa?.usuario?.nombre || "-",
    },
    {
      key: "estado",
      title: "Estado",
      align: "center",
      render: (value) => {
        const estado = value as string;
        let variant: "default" | "destructive" | "secondary" | "outline" = "default";
        switch (estado) {
          case "EN_REVISION":
            variant = "outline"; // antes 'warning'
            break;
          case "ACEPTADA":
            variant = "secondary"; // antes 'success'
            break;
          case "RECHAZADA":
          case "CANCELADA":
            variant = "destructive";
            break;
        }
        return <Badge variant={variant}>{estado.replace("_", " ")}</Badge>;
      }
    },
    {
      key: "fechaPostula",
      title: "Fecha de postulación",
      render: (value) => new Date(value as string).toLocaleDateString(),
    },
    {
      key: "id",
      title: "Acciones",
      align: "center",
      render: (_, record) => (
        record.estado === "EN_REVISION" && (
          <Button size="sm" variant="destructive" onClick={() => handleCancel(record.id)}>
            Cancelar
          </Button>
        )
      ),
    }
  ];
  return (
    <div>
      <SectionComponent classNameContainer="pb-5" classNameContent="max-w-6xl" id="perfil">
        <ProfileCard />
      </SectionComponent>
      <SectionComponent classNameContent="max-w-6xl" id="vacantes">
        <VacanciesList />
      </SectionComponent>
      <SectionComponent classNameContent="max-w-6xl" id="postulaciones">
        <Card className="border border-zinc-200 shadow-sm w-full">
          <CardHeader>
            <h2 className="text-lg font-semibold text-zinc-800">
              Mis postulaciones
            </h2>
          </CardHeader>

          <CardContent>
            <Table<Postulation>
              columns={columns}
              data={postulations}
              total={total}
              page={page}
              pageSize={pageSize}
              loading={loading}
              onChange={({ page: newPage }) => fetchPostulations(newPage)}
            />
          </CardContent>
        </Card>
      </SectionComponent>
    </div>
  )
}
