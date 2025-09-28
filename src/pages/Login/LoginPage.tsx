import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export const LoginPage = () => {
  const [nit, setNit] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ nit, password });
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
            >
              🚀 Accede con correo institucional
            </Button>

            <div className="flex items-center">
              <Separator className="flex-1" />
              <span className="px-2 text-xs text-gray-400">o acceso para empresas</span>
              <Separator className="flex-1" />
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="nit">NIT de la empresa</Label>
                <Input
                  id="nit"
                  type="text"
                  placeholder="Ej: 900123456-7"
                  value={nit}
                  onChange={(e) => setNit(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
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
