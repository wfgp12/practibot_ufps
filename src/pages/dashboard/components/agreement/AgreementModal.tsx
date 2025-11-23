import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Handshake, Upload } from "lucide-react";
import { useAgreements } from "@/hooks/useAgreements";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useVacancies } from "@/hooks/useVacancies";

const schema = z.object({
    empresaId: z.number(),
    nombre: z.string().min(3, "El nombre es obligatorio"),
    descripcion: z.string().optional(),
    tipo: z.enum(["MACRO", "ESPECIFICO"]),
    estado: z.enum(["EN_REVISION", "APROBADO", "RECHAZADO"]),
    observaciones: z.string().optional(),
    file: z.instanceof(File).optional(),
    fechaInicio: z.string().nonempty("La fecha de inicio es obligatoria"),
    fechaFin: z.string().nonempty("La fecha de fin es obligatoria"),
});

type FormValues = z.infer<typeof schema>;

export const AgreementModal = ({ empresaId, onCreated }: { empresaId?: number, onCreated?: () => Promise<void> }) => {
    const [open, setOpen] = useState(false);
    const { companiesList, fetchListCompanies, loading: loadingEmpresas } = useVacancies();
    const { createAgreementByDirector } = useAgreements();
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            empresaId,
            estado: "EN_REVISION",
            tipo: "MACRO",
        },
    });

    useEffect(() => {
        if (!open) reset();
    }, [open, reset]);

    useEffect(() => {
        if (!empresaId) {
            fetchListCompanies(["APROBADA", "HABILITADA"]);
        }
    }, [empresaId, fetchListCompanies]);

    const onSubmit = async (data: FormValues) => {
        try {
            await createAgreementByDirector({
                empresaId: data.empresaId,
                nombre: data.nombre,
                descripcion: data.descripcion,
                tipo: data.tipo,
                observaciones: data.observaciones,
                file: data.file,
                fechaInicio: data.fechaInicio,
                fechaFin: data.fechaFin,
                estado: data.estado,
            });
            if (onCreated) await onCreated();
            toast.success("Convenio creado correctamente.");
            setOpen(false);
        } catch (err) {
            console.error("Error al crear convenio:", err);
            toast.error("Error al crear el convenio");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-[#AA1916] text-white hover:bg-red-800">
                    <Handshake /> Agregar Convenio
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Registrar nuevo convenio</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
                    {!empresaId && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Empresa</label>
                            <Select
                                value={watch("empresaId")?.toString() || ""}
                                onValueChange={(v) => setValue("empresaId", Number(v))}
                                disabled={loadingEmpresas}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccione una empresa" />
                                </SelectTrigger>
                                <SelectContent>
                                    {companiesList.map((e) => (
                                        <SelectItem key={e.id} value={e.id.toString()}>
                                            {e.nombre}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.empresaId && (
                                <p className="text-red-500 text-xs mt-1">{errors.empresaId.message}</p>
                            )}
                        </div>
                    )}
                    {/* Nombre */}
                    <div>
                        <label className="block text-sm font-medium">Nombre</label>
                        <Input {...register("nombre")} placeholder="Convenio marco 2025" />
                        {errors.nombre && (
                            <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>
                        )}
                    </div>

                    {/* Tipo */}
                    <div>
                        <label className="block text-sm font-medium">Tipo</label>
                        <Select
                            value={watch("tipo")}
                            onValueChange={(v: FormValues["tipo"]) => setValue("tipo", v)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccione un tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="MACRO">Macro</SelectItem>
                                <SelectItem value="ESPECIFICO">Específico</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.tipo && (
                            <p className="text-red-500 text-xs mt-1">{errors.tipo.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Estado inicial</label>
                        <Select
                            value={watch("estado")}
                            onValueChange={(v: FormValues["estado"]) => setValue("estado", v)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccione un estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="EN_REVISION">En revisión</SelectItem>
                                <SelectItem value="APROBADO">Aprobado</SelectItem>
                                <SelectItem value="RECHAZADO">Rechazado</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.estado && (
                            <p className="text-red-500 text-xs mt-1">{errors.estado.message}</p>
                        )}
                    </div>

                    {/* Fechas */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium">Fecha de inicio</label>
                            <Input type="date" {...register("fechaInicio")} />
                            {errors.fechaInicio && (
                                <p className="text-red-500 text-xs mt-1">{errors.fechaInicio.message}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Fecha de fin</label>
                            <Input type="date" {...register("fechaFin")} />
                            {errors.fechaFin && (
                                <p className="text-red-500 text-xs mt-1">{errors.fechaFin.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block text-sm font-medium">Descripción</label>
                        <Textarea
                            {...register("descripcion")}
                            placeholder="Descripción breve del convenio"
                        />
                    </div>

                    {/* Observaciones */}
                    {/* <div>
                        <label className="block text-sm font-medium">Observaciones</label>
                        <Textarea
                            {...register("observaciones")}
                            placeholder="Notas u observaciones"
                        />
                    </div> */}

                    {/* Archivo */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Archivo del convenio</label>
                        <Button type="button" variant="outline" className="flex items-center gap-2" asChild>
                            <label>
                                <Upload className="h-4 w-4" />{" "}
                                {watch("file")?.name ?? "Seleccionar archivo"}
                                <input
                                    type="file"
                                    hidden
                                    accept=".pdf,.doc,.docx"
                                    onChange={(e) => setValue("file", e.target.files?.[0])}
                                />
                            </label>
                        </Button>
                    </div>

                    <div className="flex justify-end pt-3">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-[#AA1916] text-white hover:bg-red-800"
                        >
                            {isSubmitting ? "Creando..." : "Crear Convenio"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
