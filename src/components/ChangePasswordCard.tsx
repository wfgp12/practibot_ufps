import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authApi } from "@/api/authApi";
import { toast } from "sonner";

const passwordSchema = z
    .object({
        currentPassword: z.string().min(1, "La contraseña actual es obligatoria"),
        newPassword: z
            .string()
            .min(8, "Debe tener al menos 8 caracteres")
            .regex(/[a-z]/, "Debe tener al menos una letra minúscula")
            .regex(/[A-Z]/, "Debe tener al menos una letra mayúscula")
            .regex(/\d/, "Debe tener al menos un número")
            .regex(/[^A-Za-z0-9]/, "Debe tener al menos un carácter especial"),
        confirmPassword: z.string().min(1, "Debe confirmar la contraseña"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"],
    });

type PasswordFormData = z.infer<typeof passwordSchema>;

export const ChangePasswordCard = () => {
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        reset,
    } = useForm<PasswordFormData>({
        resolver: zodResolver(passwordSchema),
    });

    const newPassword = watch("newPassword");

    const requirements = [
        { label: "Mínimo 8 caracteres", test: /.{8,}/ },
        { label: "Al menos una letra minúscula", test: /[a-z]/ },
        { label: "Al menos una letra mayúscula", test: /[A-Z]/ },
        { label: "Al menos un número", test: /\d/ },
        { label: "Al menos un carácter especial", test: /[^A-Za-z0-9]/ },
    ];

    const onSubmit = async (data: PasswordFormData) => {
        try {
            await authApi.changePassword(data.currentPassword, data.newPassword);
            toast.success("Contraseña actualizada correctamente");
            reset();
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Error desconocido al cambiar la contraseña");
            }
        }
    };

    return (
        <Card className="border border-border/60 shadow-md hover:shadow-lg transition-all duration-200 w-full mt-8">
            <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <Lock className="w-5 h-5 text-primary" />
                    Cambiar contraseña
                </CardTitle>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Contraseña actual */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">Contraseña actual</label>
                        <div className="relative w-full">
                            <Input
                                type={showCurrent ? "text" : "password"}
                                placeholder="••••••••"
                                {...register("currentPassword")}
                                className="w-full"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrent(!showCurrent)}
                                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                            >
                                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.currentPassword && (
                            <p className="text-xs text-red-500">{errors.currentPassword.message}</p>
                        )}
                    </div>

                    {/* Nueva + Confirmar */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                        {/* Nueva contraseña */}
                        <div className="flex flex-col gap-1 w-full">
                            <label className="text-sm font-medium text-gray-600">Nueva contraseña</label>
                            <div className="relative w-full">
                                <Input
                                    type={showNew ? "text" : "password"}
                                    placeholder="••••••••"
                                    {...register("newPassword")}
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={() => setIsFocused(false)}
                                    className="w-full"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNew(!showNew)}
                                    className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                                >
                                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.newPassword && (
                                <p className="text-xs text-red-500">{errors.newPassword.message}</p>
                            )}

                            <div
                                className={`overflow-hidden transition-all duration-300 ${isFocused || watch("newPassword")?.length > 0 ? "max-h-40 mt-2" : "max-h-0"
                                    }`}
                            >
                                <ul className="text-sm space-y-1">
                                    {requirements.map((req, i) => {
                                        const valid = req.test.test(newPassword || "");
                                        return (
                                            <li key={i} className="flex items-center gap-2">
                                                {valid ? (
                                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                ) : (
                                                    <XCircle className="w-4 h-4 text-red-500" />
                                                )}
                                                <span
                                                    className={`${valid ? "text-green-600" : "text-red-600"
                                                        } transition-colors duration-200`}
                                                >
                                                    {req.label}
                                                </span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>

                        {/* Confirmar contraseña */}
                        <div className="flex flex-col gap-1 w-full">
                            <label className="text-sm font-medium text-gray-600">Confirmar contraseña</label>
                            <div className="relative w-full">
                                <Input
                                    type={showConfirm ? "text" : "password"}
                                    placeholder="••••••••"
                                    {...register("confirmPassword")}
                                    className="w-full"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                                >
                                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>


                            {errors.confirmPassword && (
                                <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
                            )}
                        </div>
                    </div>

                    <Button type="submit" disabled={isSubmitting} className="w-full mt-2">
                        {isSubmitting ? "Actualizando..." : "Cambiar contraseña"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};
