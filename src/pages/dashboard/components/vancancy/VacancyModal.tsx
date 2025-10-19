import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

import { Briefcase, FileText, Building2, Clock, ClipboardList, Globe } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { hideLoader, showLoader } from "@/store/slices/uiSlice";
import { useVacancies } from "@/hooks/useVacancies";
import type { IFormRegisterVacancy } from "@/models/IVacancy";

const vacancySchema = z.object({
    empresaId: z.string().min(1, "Selecciona una empresa"),
    titulo: z.string().min(3, "El título es obligatorio"),
    modalidad: z.string().min(3, "La modalidad es obligatoria"),
    tipoJornada: z.string().min(3, "El tipo de jornada es obligatoria"),
    descripcion: z.string().min(10, "Agrega una descripción más detallada"),
    requisitos: z.string().min(3, "Indica al menos un requisito"),
});

type VacancyFormSchema = z.infer<typeof vacancySchema>;

interface VacancyModalProps {
    vacancy?: IFormRegisterVacancy;
    onSubmit: (data: IFormRegisterVacancy, id?: string) => Promise<void>;
}

export const VacancyModal = ({ vacancy, onSubmit }: VacancyModalProps) => {
    const dispatch = useAppDispatch();
    const { loading } = useAppSelector((state) => state.ui);
    const { fetchListCompanies, companiesList } = useVacancies();
    const [open, setOpen] = useState(false);

    const form = useForm<VacancyFormSchema>({
        resolver: zodResolver(vacancySchema),
        defaultValues: {
            empresaId: String(vacancy?.empresaId) || "",
            titulo: vacancy?.titulo || "",
            modalidad: vacancy?.modalidad || "",
            tipoJornada: vacancy?.tipoJornada || "",
            descripcion: vacancy?.descripcion || "",
            requisitos: vacancy?.requisitos || "",
        },
    });

    useEffect(() => {
        fetchListCompanies();
    }, [fetchListCompanies]);


    const handleSubmit = async (values: VacancyFormSchema) => {
        dispatch(showLoader());
        try {
            await onSubmit({ ...values, empresaId: Number(values.empresaId) }, vacancy?.empresaId ? String(vacancy.empresaId) : undefined);
            toast.success(vacancy ? "Vacante actualizada correctamente" : "Vacante creada correctamente");
            form.reset();
            setOpen(false);
        } catch {
            toast.error("Ocurrió un error al guardar la vacante");
        } finally {
            dispatch(hideLoader());
        }
    };

    const isEditMode = !!vacancy;

    const modalidades = [
        { label: "Presencial", value: "Presencial" },
        { label: "Remoto", value: "Remoto" },
        { label: "Híbrido", value: "Híbrido" },
    ];

    const jornadas = [
        { label: "Tiempo completo", value: "Tiempo completo" },
        { label: "Medio tiempo", value: "Medio tiempo" },
        { label: "Prácticas", value: "Prácticas" },
    ];

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (!isOpen) form.reset(); // Reinicia formulario al cerrar
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button className="flex items-center gap-2 bg-red-500 hover:bg-red-800">
                    <Briefcase className="w-4 h-4" />
                    {isEditMode ? "Editar Vacante" : "Registrar Vacante"}
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? "Editar vacante" : "Registrar nueva vacante"}</DialogTitle>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    {/* Empresa */}
                    <div className="grid gap-3">
                        <Label>Empresa</Label>
                        <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-gray-500" />
                            <Select
                                onValueChange={(value) => form.setValue("empresaId", value)}
                                defaultValue={form.watch("empresaId") || undefined}

                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona una empresa" />
                                </SelectTrigger>
                                <SelectContent>
                                    {companiesList.map((c) => (
                                        <SelectItem key={c.id} value={String(c.id)}>
                                            {c.nombre}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Título */}
                    <div className="grid gap-3">
                        <Label>Título</Label>
                        <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-500" />
                            <Input {...form.register("titulo")} placeholder="Ej: Desarrollador Frontend" />
                        </div>
                    </div>

                    {/* Modalidad */}
                    <div className="grid gap-3">
                        <Label>Modalidad</Label>
                        <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-gray-500" />
                            <Select
                                onValueChange={(val) => form.setValue("modalidad", val)}
                                value={form.watch("modalidad")}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona una modalidad" />
                                </SelectTrigger>
                                <SelectContent>
                                    {modalidades.map((item) => (
                                        <SelectItem key={item.value} value={item.value}>
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Tipo de jornada */}
                    <div className="grid gap-3">
                        <Label>Tipo de jornada</Label>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <Select
                                onValueChange={(val) => form.setValue("tipoJornada", val)}
                                value={form.watch("tipoJornada")}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona tipo de jornada" />
                                </SelectTrigger>
                                <SelectContent>
                                    {jornadas.map((item) => (
                                        <SelectItem key={item.value} value={item.value}>
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Descripción */}
                    <div className="grid gap-3">
                        <Label>Descripción</Label>
                        <Textarea
                            {...form.register("descripcion")}
                            placeholder="Describe las responsabilidades o tareas principales..."
                        />
                    </div>

                    {/* Requisitos */}
                    <div className="grid gap-3">
                        <Label>Requisitos</Label>
                        <div className="flex items-start gap-2">
                            <ClipboardList className="w-4 h-4 text-gray-500 mt-1" />
                            <Textarea
                                {...form.register("requisitos")}
                                placeholder="Ej: React, Node.js, SQL..."
                            />
                        </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                        <Button
                            type="submit"
                            className={`w-full disabled:bg-gray-500 bg-red-500 hover:bg-red-800`}
                            disabled={loading}
                        >
                            {loading
                                ? isEditMode
                                    ? "Actualizando..."
                                    : "Creando..."
                                : isEditMode
                                    ? "Actualizar Vacante"
                                    : "Registrar Vacante"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
