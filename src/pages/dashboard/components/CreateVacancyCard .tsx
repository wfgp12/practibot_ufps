import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useVacancies } from "@/hooks/useVacancies";


const vacancySchema = z.object({
    titulo: z.string().min(3, "El título es obligatorio"),
    modalidad: z.string().min(1, "Selecciona una modalidad"),
    tipoJornada: z.string().min(1, "Selecciona el tipo de jornada"),
    descripcion: z.string().min(10, "Agrega una descripción más detallada"),
    requisitos: z.string().min(3, "Agrega al menos un requisito"),
});

type VacancyFormData = z.infer<typeof vacancySchema>;

export const CreateVacancyCard = () => {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<VacancyFormData>({
        resolver: zodResolver(vacancySchema),
    });

    const { addVacancy } = useVacancies();
    const [submitting, setSubmitting] = useState(false);

    const onSubmit = async (data: VacancyFormData) => {
        try {
            setSubmitting(true);
            await addVacancy(data);
            reset();
            toast.success("Vacante enviada a revisión");
        } catch (error) {
            console.error(error);
            toast.error("Error al enviar la vacante");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Card className="border border-border/60 shadow-md hover:shadow-lg transition-all duration-200 w-full">
            <CardHeader>
                <CardTitle>Crear nueva vacante</CardTitle>
                <CardDescription>
                    Completa la información para enviar la vacante a revisión
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Título */}
                        <div className="sm:col-span-2">
                            <Label htmlFor="titulo">Título de la vacante</Label>
                            <Input
                                id="titulo"
                                placeholder="Ej: Desarrollador Backend"
                                {...register("titulo")}
                            />
                            {errors.titulo && (
                                <p className="text-sm text-red-500 mt-1">
                                    {errors.titulo.message}
                                </p>
                            )}
                        </div>

                        {/* Modalidad */}
                        <div>
                            <Label>Modalidad</Label>
                            <Select onValueChange={(v) => setValue("modalidad", v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona una modalidad" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="presencial">Presencial</SelectItem>
                                    <SelectItem value="remoto">Remoto</SelectItem>
                                    <SelectItem value="hibrido">Híbrido</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.modalidad && (
                                <p className="text-sm text-red-500 mt-1">
                                    {errors.modalidad.message}
                                </p>
                            )}
                        </div>

                        {/* Tipo de jornada */}
                        <div>
                            <Label>Tipo de jornada</Label>
                            <Select onValueChange={(v) => setValue("tipoJornada", v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona tipo de jornada" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="tiempo-completo">
                                        Tiempo completo
                                    </SelectItem>
                                    <SelectItem value="medio-tiempo">Medio tiempo</SelectItem>
                                    <SelectItem value="practicas">Prácticas</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.tipoJornada && (
                                <p className="text-sm text-red-500 mt-1">
                                    {errors.tipoJornada.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Descripción */}
                    <div>
                        <Label htmlFor="descripcion">Descripción</Label>
                        <Textarea
                            id="descripcion"
                            placeholder="Describe las responsabilidades y tareas principales"
                            {...register("descripcion")}
                        />
                        {errors.descripcion && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.descripcion.message}
                            </p>
                        )}
                    </div>

                    {/* Requisitos */}
                    <div>
                        <Label htmlFor="requisitos">Requisitos</Label>
                        <Textarea
                            id="requisitos"
                            placeholder="Lista de requisitos (Ej: React, Javascript, SQL)"
                            {...register("requisitos")}
                        />
                        {errors.requisitos && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.requisitos.message}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end pt-2">
                        <Button
                            type="submit"
                            disabled={submitting || isSubmitting}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            {submitting ? "Enviando..." : "Enviar a revisión"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};
