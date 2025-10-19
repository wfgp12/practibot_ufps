import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Building2, Mail, Phone, MapPin } from "lucide-react"
import { toast } from "sonner"
import type { ICompany, IRegisterCompanyData } from "@/models/ICompany"
import { useState } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { hideLoader, showLoader } from "@/store/slices/uiSlice"


const empresaSchema = z.object({
  nombre: z.string().min(3, "El nombre es obligatorio"),
  nit: z.string().min(5, "El NIT es obligatorio"),
  telefono: z.string().min(7, "El teléfono es obligatorio"),
  direccion: z.string().min(3, "La dirección es obligatoria"),
  email: z.string().email("Correo inválido"),
  sector: z.string().min(1, "Selecciona un sector"),
  descripcion: z.string().optional(),
})

type CompanyFormSchema = z.infer<typeof empresaSchema>

interface CreateCompanyModalProps {
  company?: ICompany
  onSubmit: (data: IRegisterCompanyData, id?: string) => Promise<void>
}

export const CompanyModal = ({ company, onSubmit }: CreateCompanyModalProps) => {
  const dispatch = useAppDispatch()
  const { loading } = useAppSelector(state => state.ui)
  const [open, setOpen] = useState(false);

  const form = useForm<CompanyFormSchema>({
    resolver: zodResolver(empresaSchema),
    defaultValues: {
      nombre: company?.nombre || "",
      nit: company?.nit || "",
      telefono: company?.telefono || "",
      direccion: company?.direccion || "",
      email: company?.correo || "",
      sector: company?.sector || "",
      descripcion: company?.descripcion || "",
    },
  })

  const sectores = [
    { label: "Tecnología", value: "tecnologia" },
    { label: "Educación", value: "educacion" },
    { label: "Salud", value: "salud" },
    { label: "Finanzas", value: "finanzas" },
    { label: "Comercio", value: "comercio" },
    { label: "Servicios", value: "servicios" },
    { label: "Otro", value: "otro" },
  ]

  const handleSubmit = async (values: CompanyFormSchema) => {
    dispatch(showLoader());
    try {
      await onSubmit(values, company?.id)
      toast.success(company ? "Empresa actualizada correctamente" : "Empresa creada correctamente")
      form.reset()
      setOpen(false)
    } catch {
      toast.error("Ocurrió un error al crear la empresa")
    } finally {
      dispatch(hideLoader())
    }
  }

  const isEditMode = !!company

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 bg-red-500 hover:bg-red-800">
          <Building2 className="w-4 h-4" />
          {isEditMode ? "Editar Empresa" : "Crear Empresa"}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Editar empresa" : "Registrar nueva empresa"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid gap-3">
            <Label>Nombre de la empresa</Label>
            <Input {...form.register("nombre")} placeholder="Ej: TechSolutions S.A.S." />
          </div>

          <div className="grid gap-3">
            <Label>NIT</Label>
            <Input {...form.register("nit")} placeholder="Ej: 901234567-8" />
          </div>

          <div className="grid gap-3">
            <Label>Teléfono</Label>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500" />
              <Input {...form.register("telefono")} placeholder="Ej: 3001234567" />
            </div>
          </div>

          <div className="grid gap-3">
            <Label>Dirección</Label>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <Input {...form.register("direccion")} placeholder="Ej: Calle 10 #5-20" />
            </div>
          </div>

          <div className="grid gap-3">
            <Label>Correo electrónico</Label>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <Input type="email" {...form.register("email")} placeholder="empresa@correo.com" />
            </div>
          </div>

          <div className="grid gap-3">
            <Label>Sector</Label>
            <Select onValueChange={(value) => form.setValue("sector", value)} value={form.watch("sector")} >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un sector" />
              </SelectTrigger>
              <SelectContent>
                {sectores.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-3">
            <Label>Descripción (opcional)</Label>
            <Textarea {...form.register("descripcion")} placeholder="Breve descripción de la empresa..." />
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" className={`w-full disabled:bg-gray-500 bg-red-500 hover:bg-red-800`} disabled={loading}>
              {loading ? (isEditMode ? "Actualizando..." : "Creando...") : isEditMode ? "Actualizar" : "Registrar Empresa"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
