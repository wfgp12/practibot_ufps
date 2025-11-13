import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { IStudent } from "@/models/IStudent";
import { Loader2, UserPen } from "lucide-react";

// 🧩 Validación
const studentProfileSchema = z.object({
    name: z.string().min(2, "El nombre es obligatorio"),
    email: z.string().email("Correo inválido"),
    code: z.string().min(3, "El código es obligatorio"),
    document: z.string().min(6, "La cédula es obligatoria"),
    phone: z.string().min(7, "Número inválido"),
    area: z.string().min(3, "Área requerida"),
    description: z.string().min(10, "La descripción es obligatoria"),
    technicalSkills: z.string().optional(),
    softSkills: z.string().optional(),
    experience: z.string().optional(),
});

type StudentProfileForm = z.infer<typeof studentProfileSchema>;

interface Props {
    student: IStudent;
    onSave?: (payload: Partial<IStudent>) => Promise<IStudent | undefined>;
}

export const StudentProfileModal = ({ student, onSave }: Props) => {
    const [open, setOpen] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<StudentProfileForm>({
        resolver: zodResolver(studentProfileSchema),
        defaultValues: {
            name: student.name,
            email: student.email,
            code: student.code || "",
            document: student.document || "",
            phone: student.phone || "",
            area: student.area || "",
            description: student.description || "",
            technicalSkills: student.technicalSkills?.join(", ") || "",
            softSkills: student.softSkills?.join(", ") || "",
            experience: student.experience || "",
        },
    });

    useEffect(() => {
        reset({
            name: student.name,
            email: student.email,
            code: student.code || "",
            document: student.document || "",
            phone: student.phone || "",
            area: student.area || "",
            description: student.description || "",
            technicalSkills: student.technicalSkills?.join(", ") || "",
            softSkills: student.softSkills?.join(", ") || "",
            experience: student.experience || "",
        });
    }, [student, reset]);

    const onSubmit = async (values: StudentProfileForm) => {
        try {
            const payload: Partial<IStudent> = {
                phone: values.phone,
                area: values.area,
                description: values.description,
                technicalSkills: values.technicalSkills
                    ? values.technicalSkills.split(",").map((s) => s.trim())
                    : [],
                softSkills: values.softSkills
                    ? values.softSkills.split(",").map((s) => s.trim())
                    : [],
                experience: values.experience,
            };
            await onSave?.(payload);
            toast.success(student.profileComplete ? "✅ Perfil actualizado" : "🎉 Perfil completado");
            setOpen(false);
        } catch (error) {
            toast.error("❌ Error guardando perfil");
            console.error(error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2">
                    <UserPen className="w-4 h-4" />
                    {student.profileComplete ? "Editar perfil" : "Completar perfil"}
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg bg-white border border-zinc-300 shadow-xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-zinc-800">
                        <UserPen className="w-5 h-5 text-red-600" />
                        {student.profileComplete ? "Editar perfil de estudiante" : "Completar perfil de estudiante"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-zinc-700">Nombre</label>
                            <Input {...register("name")} disabled className="bg-zinc-100" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-zinc-700">Correo</label>
                            <Input {...register("email")} disabled className="bg-zinc-100" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-zinc-700">Código</label>
                            <Input {...register("code")} disabled className="bg-zinc-100" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-zinc-700">Cédula</label>
                            <Input {...register("document")} disabled className="bg-zinc-100" />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-zinc-700">Teléfono</label>
                        <Input {...register("phone")} placeholder="Ej: 3004567890" />
                        {errors.phone && <p className="text-xs text-red-600">{errors.phone.message}</p>}
                    </div>

                    <div>
                        <label className="text-sm font-medium text-zinc-700">Área de interés</label>
                        <Input {...register("area")} placeholder="Ej: Desarrollo Web" />
                        {errors.area && <p className="text-xs text-red-600">{errors.area.message}</p>}
                    </div>

                    <div>
                        <label className="text-sm font-medium text-zinc-700">Descripción</label>
                        <Textarea {...register("description")} placeholder="Cuéntanos sobre ti..." />
                        {errors.description && <p className="text-xs text-red-600">{errors.description.message}</p>}
                    </div>

                    <div>
                        <label className="text-sm font-medium text-zinc-700">Habilidades técnicas</label>
                        <Input {...register("technicalSkills")} placeholder="Ej: React, Node.js, SQL" />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-zinc-700">Habilidades blandas</label>
                        <Input {...register("softSkills")} placeholder="Ej: Comunicación, Liderazgo" />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-zinc-700">Experiencia</label>
                        <Textarea {...register("experience")} placeholder="Describe tus proyectos o prácticas..." />
                    </div>

                    <DialogFooter>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                student.profileComplete ? "Guardar cambios" : "Completar perfil"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
