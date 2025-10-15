import { Controller, useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { toast } from "sonner"
import type { IRegisterCompanyData } from "@/models/ICompany"

export interface CompanyFormData {
  nombreEmpresa: string
  nit: string
  correo: string
  telefono?: string
  direccion?: string
  sector?: string
  descripcion?: string
}

interface CompanyFormProps {
  defaultValues?: CompanyFormData
  onSubmit: (data: IRegisterCompanyData) => Promise<void>
  submitLabel?: string
}

export const CompanyForm = ({ defaultValues, onSubmit, submitLabel = "Enviar" }: CompanyFormProps) => {
  const { handleSubmit, control, reset } = useForm<CompanyFormData>({
    defaultValues: defaultValues || {
      nombreEmpresa: "",
      nit: "",
      correo: "",
      telefono: "",
      direccion: "",
      sector: "",
      descripcion: "",
    },
  })

  const handleFormSubmit = async (data: CompanyFormData) => {
    try {
      await onSubmit({
        nombre: data.nombreEmpresa,
        email: data.correo,
        nit: data.nit,
        telefono: data.telefono || "",
        direccion: data.direccion || "",
        sector: data.sector || "",
        descripcion: data.descripcion || "",
      })
      reset()
    } catch (error: unknown) {
      if (error instanceof Error) toast.error(error.message)
      else toast.error("Error desconocido")
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
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
            <Select onValueChange={field.onChange} value={field.value}>
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
            <Textarea {...field} placeholder="Describe brevemente la trayectoria y actividades principales de la empresa" />
          )}
        />
      </div>

      <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
        {submitLabel}
      </Button>
    </form>
  )
}
