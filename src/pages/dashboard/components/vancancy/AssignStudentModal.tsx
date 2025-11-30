import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, type Column } from "@/components/Table";
import { useStudents } from "@/hooks/useStudents";
import type { IStudent } from "@/models/IStudent";
import { PostulationApi } from "@/api/postulationApi";

export const AssignStudentsModal = ({
    vacancyId,
    onAssigned,
}: {
    vacancyId: number;
    onAssigned?: () => void;
}) => {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<number[]>([]);

    const {
        students,
        total,
        page,
        pageSize,
        loading,
        fetchStudents,
        setPage,
        setFilters
    } = useStudents(vacancyId);

    const handleOpen = (value: boolean) => {
        setOpen(value);
        if (value) fetchStudents(); // solo carga al abrir
    };

    const toggleSelect = (id: number) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const handleAssign = async () => {
        if (selected.length === 0) return;

        await PostulationApi.postulateMultiple(vacancyId, selected);

        onAssigned?.();
        setOpen(false);
        setSelected([]);
    };

    const columns: Column<IStudent>[] = [
        {
            key: "id",
            title: "",
            render: (_, row) => (
                <input
                    type="checkbox"
                    checked={selected.includes(row.id)}
                    onChange={() => toggleSelect(row.id)}
                />
            ),
        },
        { key: "name", title: "Nombre", filterType: "text" },
        { key: "code", title: "Código", filterType: "text" },
        { key: "email", title: "Correo institucional", filterType: "text" },
        {
            key: "active",
            title: "Estado",
            render: (active) => (
                <span className={active ? "text-green-600" : "text-red-600"}>
                    {active ? "Activo" : "Inactivo"}
                </span>
            ),
        },
    ];

    return (
        <Dialog open={open} onOpenChange={handleOpen} >
            <DialogTrigger asChild>
                <Button className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2" variant="default">Postular estudiantes</Button>
            </DialogTrigger>

            <DialogContent className="w-full max-w-none sm:max-w-[50vw] max-h-[90vh]">

                <DialogHeader>
                    <DialogTitle>Seleccionar estudiantes</DialogTitle>
                </DialogHeader>

                <div className="mt-4 overflow-auto">
                    <Table
                        columns={columns}
                        data={students}
                        total={total}
                        page={page}
                        pageSize={pageSize}
                        loading={loading}
                        onChange={({ page, filters }) => {
                            setPage(page)
                            setFilters({
                                codigo: filters.code,
                                documento: filters.document,
                                email: filters.email,
                                nombre: filters.name,
                            });
                        }}
                    />
                </div>

                <DialogFooter className="mt-4">
                    <Button
                        disabled={selected.length === 0}
                        onClick={handleAssign}
                        className="bg-red-600 text-white"
                    >
                        Asignar selección
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
