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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Mail, UserPen, UserPlus, Loader2, IdCard, IdCardLanyard } from "lucide-react";
import type { IStudent } from "@/models/IStudent";
import { useStudent } from "@/hooks/useStudent";

const studentSchema = z.object({
    name: z.string().min(2, "El nombre es obligatorio"),
    email: z.string().email("Correo inválido"),
    code: z.string().min(2, "El código es obligatorio"),
    document: z.string().min(2, "El documento es obligatorio"),
});

type StudentFormData = z.infer<typeof studentSchema>;

interface StudentModalProps {
    student?: IStudent | null;
    onSuccess?: () => void; // callback para refrescar la tabla
}

export const StudentModal = ({ student, onSuccess }: StudentModalProps) => {
    const [open, setOpen] = useState(false);
    const { createStudent, updateStudent, loading } = useStudent(open ? student?.id ?? null : null);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<StudentFormData>({
        resolver: zodResolver(studentSchema),
        defaultValues: {
            name: student?.name || "",
            email: student?.email || "",
            code: student?.code || "",
            document: student?.document || "",
        },
    });

    useEffect(() => {
        reset({
            name: student?.name || "",
            email: student?.email || "",
            code: student?.code || "",
            document: student?.document || "",
        });
    }, [student, reset]);

    const onSubmit = async (values: StudentFormData) => {
        try {
            if (student) {
                await updateStudent(values);
                toast.success("✅ Estudiante actualizado correctamente");
            } else {
                await createStudent({
                    nombre: values.name,
                    email: values.email,
                    codigo: values.code,
                    documento: values.document,
                });
                toast.success("🎉 Estudiante creado correctamente");
                reset();
            }
            onSuccess?.();
            setOpen(false);
        } catch (error) {
            toast.error("❌ Error guardando estudiante");
            console.error(error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2">
                    {student ?
                        <>
                            <UserPen className="w-4 h-4" /> Editar
                        </>
                        : <>
                            <UserPlus className="w-4 h-4" />
                            Agregar estudiante
                        </>
                    }
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md bg-white border border-zinc-300 shadow-xl">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-zinc-800 flex items-center gap-2">
                        {student ? (
                            <>
                                <UserPen className="w-5 h-5 text-red-600" />
                                Editar estudiante
                            </>
                        ) : (
                            <>
                                <UserPlus className="w-5 h-5 text-red-600" />
                                Agregar estudiante
                            </>
                        )}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-2">
                    {/* Campo: Nombre */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-zinc-700">Nombre</label>
                        <div className="relative">
                            <UserPen className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                            <Input
                                {...register("name")}
                                placeholder="Nombre completo"
                                className="pl-9 border-zinc-300 focus:border-red-600 focus:ring-red-600"
                            />
                        </div>
                        {errors.name && (
                            <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>
                        )}
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-zinc-700">Código:</label>
                        <div className="relative">
                            <IdCardLanyard className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                            <Input
                                {...register("code")}
                                placeholder="Codigo del estudiante"
                                className="pl-9 border-zinc-300 focus:border-red-600 focus:ring-red-600"
                            />
                        </div>
                        {errors.code && (
                            <p className="text-xs text-red-600 mt-1">{errors.code.message}</p>
                        )}
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-zinc-700">Numero de documento:</label>
                        <div className="relative">
                            <IdCard className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                            <Input
                                {...register("document")}
                                placeholder="Numero de documento del estudiante"
                                className="pl-9 border-zinc-300 focus:border-red-600 focus:ring-red-600"
                            />
                        </div>
                        {errors.name && (
                            <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>
                        )}
                    </div>

                    {/* Campo: Correo */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-zinc-700">Correo institucional</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                            <Input
                                {...register("email")}
                                placeholder="correo@ufps.edu.co"
                                className="pl-9 border-zinc-300 focus:border-red-600 focus:ring-red-600"
                            />
                        </div>
                        {errors.email && (
                            <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="submit"
                            disabled={isSubmitting || loading}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center justify-center gap-2"
                        >
                            {isSubmitting || loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Guardando...
                                </>
                            ) : student ? (
                                "Guardar cambios"
                            ) : (
                                "Crear estudiante"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
