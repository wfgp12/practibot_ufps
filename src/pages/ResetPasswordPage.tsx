import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAppDispatch } from "@/store/hooks";
import { resetPasswordThunk } from "@/store/thunks/authThunks";
import { toast } from "sonner";
import z from "zod";
import { CheckCircle2, Eye, EyeOff, Lock, XCircle } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

const passwordSchema = z
    .object({
        password: z
            .string()
            .min(8, "Debe tener al menos 8 caracteres")
            .regex(/[a-z]/, "Debe tener al menos una letra minúscula")
            .regex(/[A-Z]/, "Debe tener al menos una letra mayúscula")
            .regex(/\d/, "Debe tener al menos un número")
            .regex(/[^A-Za-z0-9]/, "Debe tener al menos un carácter especial"),

        confirmPassword: z.string().min(1, "Debe confirmar la contraseña"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"],
    });

type FormData = z.infer<typeof passwordSchema>;

const ResetPasswordPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const token = params.get("token");

    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isFocused, setIsFocused] = useState(false);


    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(passwordSchema),
    });

    const newPassword = watch("password");

    const requirements = [
        { label: "Mínimo 8 caracteres", test: /.{8,}/ },
        { label: "Al menos una letra minúscula", test: /[a-z]/ },
        { label: "Al menos una letra mayúscula", test: /[A-Z]/ },
        { label: "Al menos un número", test: /\d/ },
        { label: "Al menos un carácter especial", test: /[^A-Za-z0-9]/ },
    ];

    const onSubmit = async (data: FormData) => {
        if (!token) return alert("Token inválido");
        try {
            await dispatch(resetPasswordThunk({ token, newPassword: data.password })).unwrap();
            toast.success("Contraseña actualizada");
            reset();
            navigate("/login");
        } catch (err) {
            toast("Error: " + err);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <Card className="w-[380px] shadow-lg rounded-xl">
                <CardHeader className="text-center">
                    <h1 className="text-red-600 font-bold text-xl flex items-center justify-center gap-2">
                        <Lock className="w-5 h-5" />
                        Restablecer contraseña
                    </h1>
                    <p className="text-sm text-gray-500">Escribe tu nueva contraseña</p>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                        {/* Nueva contraseña */}
                        <div className="flex flex-col gap-1">
                            <Label>Nueva contraseña</Label>
                            <div className="relative">
                                <Input
                                    type={showNew ? "text" : "password"}
                                    placeholder="••••••••"
                                    {...register("password")}
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={() => setIsFocused(false)}
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowNew(!showNew)}
                                    className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                                >
                                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            {errors.password && (
                                <p className="text-xs text-red-500">{errors.password.message}</p>
                            )}

                            {/* Reglas / Indicadores */}
                            <div
                                className={`overflow-hidden transition-all duration-300 ${isFocused || newPassword?.length > 0 ? "max-h-40 mt-2" : "max-h-0"
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
                                                        } transition-colors`}
                                                >
                                                    {req.label}
                                                </span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>

                        {/* Confirmar */}
                        <div className="flex flex-col gap-1">
                            <Label>Confirmar contraseña</Label>
                            <div className="relative">
                                <Input
                                    type={showConfirm ? "text" : "password"}
                                    placeholder="••••••••"
                                    {...register("confirmPassword")}
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

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-red-600 hover:bg-red-700"
                        >
                            {isSubmitting ? "Actualizando..." : "Actualizar contraseña"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ResetPasswordPage;
