

import { useNavigate } from "react-router"
import { ChevronLeft } from "lucide-react"

import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Controller, useForm } from "react-hook-form"
import { useAppDispatch } from "@/store/hooks"
import { companyApi } from "@/api/companyApi"
import { hideLoader, showLoader } from "@/store/slices/uiSlice"
import { toast } from "sonner"

interface IFormData {
  nombreEmpresa: string
  nit: string
  correo: string
  telefono?: string
  direccion?: string
  sector?: string
  descripcion?: string
}

export const CompanyRegister = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { handleSubmit, control, reset } = useForm<IFormData>({
    defaultValues: {
      nombreEmpresa: "",
      nit: "",
      correo: "",
      telefono: "",
      direccion: "",
      sector: "",
      descripcion: "",
    },
  })

  const onSubmit = async (data: IFormData) => {
    try {
      dispatch(showLoader())

      const payload = {
        nombre: data.nombreEmpresa, // <--- mapeo aquí
        email: data.correo,         // <--- mapeo aquí
        nit: data.nit,
        telefono: data.telefono || "",
        direccion: data.direccion || "",
        sector: data.sector || "",
        descripcion: data.descripcion || "",
      }

      await companyApi.register(payload)
      toast.success("Solicitud enviada correctamente. Su empresa será revisada.")
      reset()
      navigate(-1)
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error)
        toast.error(error.message)
      } else {
        console.error("Error desconocido:", error)
        toast.error("Error al enviar la solicitud")
      }
    } finally {
      dispatch(hideLoader())
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-[600px] shadow-lg rounded-xl relative">
        <div className="absolute top-3 left-3">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 text-gray-400 hover:text-gray-600 group"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
            <span className="text-sm">Cancelar</span>
          </Button>
        </div>

        <CardHeader className="text-center mt-6">
          <h1 className="text-red-600 font-bold text-lg">Solicitud de convenio empresarial</h1>
          <p className="text-sm text-gray-500">
            Diligencia el siguiente formulario para que tu empresa pueda iniciar el proceso de convenio con la UFPS.
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {/* Nombre empresa */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="nombreEmpresa">Nombre de la empresa</Label>
              <Controller
                name="nombreEmpresa"
                control={control}
                rules={{ required: "El nombre es obligatorio" }}
                render={({ field }) => <Input {...field} placeholder="Ej: Tecnologías XYZ" />}
              />
            </div>

            {/* NIT */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="nit">NIT</Label>
              <Controller
                name="nit"
                control={control}
                rules={{ required: "El NIT es obligatorio" }}
                render={({ field }) => <Input {...field} placeholder="900123456-7" />}
              />
            </div>

            {/* Correo */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="correo">Correo de contacto</Label>
              <Controller
                name="correo"
                control={control}
                rules={{ required: "El correo es obligatorio" }}
                render={({ field }) => <Input {...field} type="email" placeholder="contacto@empresa.co" />}
              />
            </div>

            {/* Teléfono */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="telefono">Teléfono de contacto</Label>
              <Controller
                name="telefono"
                control={control}
                render={({ field }) => <Input {...field} type="tel" placeholder="+57 300 123 4567" />}
              />
            </div>

            {/* Dirección */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Controller
                name="direccion"
                control={control}
                render={({ field }) => <Input {...field} placeholder="Cl 10 #1 - 23, Cúcuta" />}
              />
            </div>

            {/* Sector */}
            <div className="flex flex-col gap-2">
              <Label>Sector empresarial</Label>
              <Controller
                name="sector"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un sector" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tecnologia">Tecnología</SelectItem>
                      <SelectItem value="comercio">Comercio</SelectItem>
                      <SelectItem value="salud">Salud</SelectItem>
                      <SelectItem value="educacion">Educación</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Descripción */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="descripcion">Descripción de la empresa</Label>
              <Controller
                name="descripcion"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    placeholder="Describe brevemente la trayectoria y actividades principales de la empresa"
                  />
                )}
              />
            </div>

            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
              Enviar solicitud
            </Button>
          </form>
        </CardContent>

        <CardFooter />
      </Card>
    </div>
  )
}
