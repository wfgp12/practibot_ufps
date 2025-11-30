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

import { Briefcase, FileText, Building2, ClipboardList, Globe } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { hideLoader, showLoader } from "@/store/slices/uiSlice";
import { useVacancies } from "@/hooks/useVacancies";
import type { IFormRegisterVacancy, IModality } from "@/models/IVacancy";

// 💬 Componente simple para mostrar errores
const FieldError = ({ error }: { error?: string }) =>
    error ? <p className="text-sm text-red-500">{error}</p> : null;

const vacancySchema = z.object({
    empresaId: z
        .number()
        .optional()
        .refine((val) => val === undefined || !isNaN(val), {
            message: "Selecciona una empresa válida",
        }),
    titulo: z.string().min(3, "El título es obligatorio"),
    area: z.string().min(3, "El área es obligatoria"),
    modalidad: z
        .enum(["PRESENCIAL", "REMOTO", "HIBRIDO"])
        .refine((val) => !!val, { message: "Selecciona una modalidad" }),
    descripcion: z.string().min(10, "Agrega una descripción más detallada"),
    habilidadesBlandas: z.string().min(3, "Indica al menos una habilidad blanda"),
    habilidadesTecnicas: z.string().min(3, "Indica al menos una habilidad técnica"),
});

type VacancyFormSchema = z.infer<typeof vacancySchema>;

interface VacancyModalProps {
    vacancy?: IFormRegisterVacancy;
    onSubmit: (data: IFormRegisterVacancy, id?: string) => Promise<void>;
}

export const VacancyModal = ({ vacancy, onSubmit }: VacancyModalProps) => {
    const dispatch = useAppDispatch();
    const { loading } = useAppSelector((state) => state.ui);
    const { user } = useAppSelector((state) => state.auth);
    const { fetchListCompanies, companiesList } = useVacancies();
    const [open, setOpen] = useState(false);

    const form = useForm<VacancyFormSchema>({
        resolver: zodResolver(vacancySchema),
        defaultValues: {
            empresaId: vacancy ? Number(vacancy.empresaId) : undefined,
            titulo: vacancy?.titulo ?? "",
            area: vacancy?.area ?? "",
            modalidad: vacancy?.modalidad ?? "PRESENCIAL",
            descripcion: vacancy?.descripcion ?? "",
            habilidadesBlandas:
                Array.isArray(vacancy?.habilidadesBlandas)
                    ? vacancy?.habilidadesBlandas.join(", ")
                    : (vacancy?.habilidadesBlandas as string) ?? "",
            habilidadesTecnicas:
                Array.isArray(vacancy?.habilidadesTecnicas)
                    ? vacancy?.habilidadesTecnicas.join(", ")
                    : (vacancy?.habilidadesTecnicas as string) ?? "",
        },
    });

    useEffect(() => {
        if (user?.role !== "EMPRESA" && open) fetchListCompanies();
    }, [open, fetchListCompanies, user]);

    const handleSubmit = async (values: VacancyFormSchema) => {
        dispatch(showLoader());
        try {
            const payload: IFormRegisterVacancy = {
                ...values,
                empresaId:
                    user?.role === "EMPRESA"
                        ? Number(user.id) // empresa autenticada crea su propia vacante
                        : Number(values.empresaId), // admin/director selecciona empresa
            };

            await onSubmit(payload, vacancy?.empresaId ? String(vacancy.empresaId) : undefined);

            toast.success(vacancy ? "Vacante actualizada correctamente" : "Vacante registrada correctamente");
            form.reset();
            setOpen(false);
        } catch (err) {
            console.error(err);
            toast.error("Ocurrió un error al guardar la vacante");
        } finally {
            dispatch(hideLoader());
        }
    };

    const isEditMode = !!vacancy;

    const modalidades = [
        { label: "Presencial", value: "PRESENCIAL" },
        { label: "Remoto", value: "REMOTO" },
        { label: "Híbrido", value: "HIBRIDO" },
    ];

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (!isOpen) form.reset();
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
                    <DialogTitle>
                        {isEditMode ? "Editar vacante" : "Registrar nueva vacante"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    {/* Empresa (solo visible para ADMIN/DIRECTOR) */}
                    {user?.role !== "EMPRESA" && (
                        <div className="grid gap-3">
                            <Label>Empresa</Label>
                            <div className="flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-gray-500" />
                                <Select
                                    value={form.watch("empresaId")?.toString() ?? ""}
                                    onValueChange={(val) => form.setValue("empresaId", Number(val))}
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
                            <FieldError error={form.formState.errors.empresaId?.message} />
                        </div>
                    )}

                    {/* Título */}
                    <div className="grid gap-3">
                        <Label>Título</Label>
                        <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-500" />
                            <Input {...form.register("titulo")} placeholder="Ej: Desarrollador Frontend" />
                        </div>
                        <FieldError error={form.formState.errors.titulo?.message} />
                    </div>

                    {/* Área */}
                    <div className="grid gap-3">
                        <Label>Área</Label>
                        <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-gray-500" />
                            <Input {...form.register("area")} placeholder="Ej: Desarrollo, DevOps..." />
                        </div>
                        <FieldError error={form.formState.errors.area?.message} />
                    </div>

                    {/* Modalidad */}
                    <div className="grid gap-3">
                        <Label>Modalidad</Label>
                        <Select
                            onValueChange={(val) => form.setValue("modalidad", val as IModality)}
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
                        <FieldError error={form.formState.errors.modalidad?.message} />
                    </div>

                    {/* Descripción */}
                    <div className="grid gap-3">
                        <Label>Descripción</Label>
                        <Textarea
                            {...form.register("descripcion")}
                            placeholder="Describe las responsabilidades principales..."
                        />
                        <FieldError error={form.formState.errors.descripcion?.message} />
                    </div>

                    {/* Habilidades técnicas */}
                    <div className="grid gap-3">
                        <Label>Habilidades técnicas</Label>
                        <div className="flex items-start gap-2">
                            <ClipboardList className="w-4 h-4 text-gray-500 mt-1" />
                            <Textarea
                                {...form.register("habilidadesTecnicas")}
                                placeholder="Ej: React, Node.js, SQL..."
                            />
                        </div>
                        <FieldError error={form.formState.errors.habilidadesTecnicas?.message} />
                    </div>

                    {/* Habilidades blandas */}
                    <div className="grid gap-3">
                        <Label>Habilidades blandas</Label>
                        <div className="flex items-start gap-2">
                            <ClipboardList className="w-4 h-4 text-gray-500 mt-1" />
                            <Textarea
                                {...form.register("habilidadesBlandas")}
                                placeholder="Ej: Comunicación, trabajo en equipo..."
                            />
                        </div>
                        <FieldError error={form.formState.errors.habilidadesBlandas?.message} />
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
