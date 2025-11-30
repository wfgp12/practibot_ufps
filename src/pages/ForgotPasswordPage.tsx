import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAppDispatch } from "@/store/hooks";
import { sendRecoveryEmailThunk } from "@/store/thunks/authThunks";
import { toast } from "sonner";
import { useState } from "react";
import { AlertTriangle } from "lucide-react";

type FormData = { nit: string };

const ForgotPasswordPage = () => {
    const { register, handleSubmit, reset } = useForm<FormData>();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [messageVisible, setMessageVisible] = useState(false);
    const [disabledBtn, setDisabledBtn] = useState(false);

    const onSubmit = async (data: FormData) => {
        try {
            setDisabledBtn(true);
            await dispatch(sendRecoveryEmailThunk(data.nit)).unwrap();

            setMessageVisible(true);
            reset();

            // reactivar botón después de 8 segundos
            setTimeout(() => setDisabledBtn(false), 8000);
            toast.success("Se ha enviado un correo con instrucciones");
        } catch (err) {
            setDisabledBtn(false);
            setMessageVisible(false);
            toast.error(String(err));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <Card className="w-[360px] shadow-lg rounded-xl">
                <CardHeader className="text-center">
                    <h1 className="text-red-600 font-bold text-xl">Recuperar contraseña</h1>
                    <p className="text-sm text-gray-500">
                        Ingresa el NIT de tu empresa
                    </p>
                </CardHeader>

                <CardContent className="flex flex-col gap-4">
                    {messageVisible && (
                        <div className="border border-yellow-400 border-dashed bg-yellow-50 text-yellow-700 p-3 rounded-lg flex gap-2 items-start">
                            <AlertTriangle className="w-5 h-5 mt-0.5 text-yellow-600" />
                            <p className="text-sm">
                                Se ha enviado un mensaje de recuperación al correo de contacto registrado.
                            </p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <Label>NIT</Label>
                            <Input
                                type="text"
                                placeholder="900123456-7"
                                {...register("nit", { required: true })}
                            />
                        </div>

                        <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={disabledBtn}>
                            Enviar enlace
                        </Button>

                        <Button
                            variant="ghost"
                            onClick={() => navigate("/login")}
                            className="w-full"
                        >
                            Volver al inicio de sesión
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ForgotPasswordPage;
