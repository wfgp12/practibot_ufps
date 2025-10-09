import { signInWithPopup } from "firebase/auth";
import { useForm, type SubmitHandler } from "react-hook-form"
import { useNavigate } from "react-router";
import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import { useAppDispatch } from "@/store/hooks";
import { loginThunk } from "@/store/thunks/authThunks";
import { auth, googleProvider } from "@/firebase";

type LoginFormData = {
  nit: string
  password: string
}

export const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch()

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>()

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    try {
      const result = await dispatch(loginThunk({ nit: data.nit, password: data.password })).unwrap()
      console.log("✅ Login exitoso:", result)
      navigate("/dashboard")
    } catch (err) {
      console.error("❌ Error en login:", err)
    }
  }

  const handleInstitutionalLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Validar correo institucional
      if (!user.email?.endsWith("@ufps.edu.co")) {
        alert("Solo correos institucionales permitidos");
        await auth.signOut();
        return;
      }

      // Obtener token de Firebase y enviar al backend
      const idToken = await user.getIdToken();
      const loginResult = await dispatch(loginThunk({ googleToken: idToken })).unwrap();

      console.log("✅ Login institucional:", loginResult);
      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Error en login institucional:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-[360px] shadow-lg rounded-xl relative">
        <div className="absolute top-3 left-3">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 text-gray-300 hover:text-gray-400 group"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
            <span className="text-sm">Cancelar</span>
          </Button>
        </div>
        <CardHeader className="text-center mt-6">
          <h1 className="text-red-600 font-bold text-xl">Prácticas UFPS</h1>
          <p className="text-sm text-gray-500">Accede a tu cuenta</p>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-4">
            <Button
              variant="outline"
              className="w-full justify-center border-gray-300"
              onClick={handleInstitutionalLogin}
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21.35 11.1H12v2.8h5.55c-.24 1.35-1.05 2.5-2.25 3.3v2.75h3.63c2.12-1.95 3.35-4.83 3.35-8.55 0-.6-.06-1.18-.16-1.75z"
                  fill="#4285F4"
                />
                <path
                  d="M12 22c2.7 0 4.95-.9 6.6-2.45l-3.63-2.75c-1 .65-2.25 1-3.97 1-3.05 0-5.63-2.05-6.55-4.8H1.7v3c1.65 3.25 4.85 5 8.3 5z"
                  fill="#34A853"
                />
                <path
                  d="M5.45 13.05c-.2-.6-.32-1.25-.32-1.95s.12-1.35.32-1.95v-3H1.7C.62 8.15 0 10 0 12s.62 3.85 1.7 5.85l3.75-2.8z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 4.8c1.47 0 2.78.5 3.82 1.45l2.85-2.85C16.95 1.8 14.7.9 12 .9 7.55.9 4.35 2.65 1.7 5.85l3.75 2.8c.9-2.75 3.5-4.85 6.55-4.85z"
                  fill="#EA4335"
                />
              </svg>
              Accede con correo institucional
            </Button>

            <div className="flex items-center">
              <Separator className="flex-1" />
              <span className="px-2 text-xs text-gray-400">o acceso para empresas</span>
              <Separator className="flex-1" />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="nit">NIT de la empresa</Label>
                <Input
                  id="nit"
                  type="text"
                  placeholder="Ej: 900123456-7"
                  {...register("nit", {
                    required: "El NIT es obligatorio",
                    pattern: {
                      value: /^[0-9]+(-[0-9])?$/, // solo números, opcional guion y un dígito final
                      message: "Formato inválido (Ej: 900123456-7)"
                    }
                  })}
                />
                {errors.nit && (
                  <span className="text-xs text-red-500">{errors.nit.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  {...register("password", {
                    required: "La contraseña es obligatoria",
                    minLength: { value: 6, message: "Mínimo 6 caracteres" }
                  })}
                />
                {errors.password && (
                  <span className="text-xs text-red-500">{errors.password.message}</span>
                )}
              </div>

              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                Ingresar
              </Button>
            </form>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center">
          <a
            href="#"
            className="text-sm text-red-600 hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}
