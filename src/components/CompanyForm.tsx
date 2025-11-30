import { Controller, useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { toast } from "sonner"
import type { IRegisterCompanyData } from "@/models/ICompany"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { Stepper } from "./Stepper"
import ProgramApi from "@/api/ProgramApi"

const representativeSchema = z.object({
  nombreCompleto: z.string().min(3, "Nombre obligatorio"),
  tipoDocumento: z.string().min(1, "Tipo de documento obligatorio"),
  numeroDocumento: z.string().min(5, "Documento inválido"),
  telefono: z.string().optional(),
  correo: z.string().email("Correo inválido"),
});

const companySchema = z.object({
  nombreEmpresa: z.string().min(3, "El nombre es obligatorio"),
  nit: z.string().min(5, "El NIT es obligatorio"),
  correo: z.string().email("Correo inválido"),
  telefono: z.string().min(13, "El teléfono es obligatorio"),
  direccion: z.string().min(5, "La dirección es obligatoria"),
  sector: z.string().min(3, "El sector es obligatorio"),
  descripcion: z.string().optional(),
  programaId: z.string().min(1, "Selecciona un programa"),
  representanteLegal: representativeSchema,
});

export type CompanyFormData = z.infer<typeof companySchema>;

interface CompanyFormProps {
  defaultValues?: CompanyFormData
  onSubmit: (data: IRegisterCompanyData) => Promise<void>
  submitLabel?: string
}

export const CompanyForm = ({ defaultValues, onSubmit, submitLabel = "Enviar" }: CompanyFormProps) => {
  const { handleSubmit, control, reset, trigger, formState: { errors, isSubmitting } } = useForm<CompanyFormData>({
    defaultValues: defaultValues || {
      nombreEmpresa: "",
      nit: "",
      correo: "",
      telefono: "",
      direccion: "",
      sector: "",
      descripcion: "",
      programaId: "",
      representanteLegal: {
        nombreCompleto: "",
        tipoDocumento: "",
        numeroDocumento: "",
        telefono: "",
        correo: "",
      },
    },
    resolver: zodResolver(companySchema),
  })
  const [step, setStep] = useState(0)
  const steps = ["Empresa", "Representante Legal"]

  const [programas, setProgramas] = useState<{ id: number; nombre: string }[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await ProgramApi.getSelectList()
        setProgramas(res)
      } catch (err) {
        console.error(err)
        toast.error("No se pudieron cargar los programas")
      }
    }
    load()
  }, [])

  const nextStep = async () => {
    const isValid = await trigger([
      "nombreEmpresa",
      "nit",
      "correo",
      "telefono",
      "direccion",
      "sector",
      "descripcion",
    ])

    if (!isValid) {
      toast.error("Hay errores en el formulario")
      return
    }

    setStep(1)
  }

  const prevStep = () => setStep(0)

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
        programaId: Number(data.programaId),
        representanteLegal: {
          nombreCompleto: data.representanteLegal?.nombreCompleto || "",
          tipoDocumento: data.representanteLegal?.tipoDocumento || "",
          numeroDocumento: data.representanteLegal?.numeroDocumento || "",
          telefono: data.representanteLegal?.telefono || "",
          email: data.representanteLegal?.correo || "",
        },
      }).then(() => reset())
    } catch (error: unknown) {
      if (error instanceof Error) toast.error(error.message)
      else toast.error("Error desconocido")
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
      <Stepper current={step} steps={steps} />
      {step === 0 && (
        <>
          {/* DATOS DE EMPRESA */}
          <div className="flex flex-col gap-2">
            <Label>Nombre de la empresa</Label>
            <Controller
              name="nombreEmpresa"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Ej: Tecnologías XYZ" />}
            />
            {errors.nombreEmpresa && <p className="text-red-600 text-sm">{errors.nombreEmpresa.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label>NIT</Label>
            <Controller
              name="nit"
              control={control}
              render={({ field }) => <Input {...field} placeholder="900123456-7" />}
            />
            {errors.nit && <p className="text-red-600 text-sm">{errors.nit.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label>Correo de contacto</Label>
            <Controller
              name="correo"
              control={control}
              render={({ field }) => <Input {...field} type="email" placeholder="contacto@empresa.co" />}
            />
            {errors.correo && <p className="text-red-600 text-sm">{errors.correo.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label>Teléfono de contacto</Label>
            <Controller
              name="telefono"
              control={control}
              render={({ field }) => <Input {...field} type="tel" placeholder="+57 300 123 4567" />}
            />
            {errors.telefono && <p className="text-red-600 text-sm">{errors.telefono.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label>Dirección</Label>
            <Controller
              name="direccion"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Cl 10 #1 - 23, Cúcuta" />}
            />
            {errors.direccion && <p className="text-red-600 text-sm">{errors.direccion.message}</p>}
          </div>

          <div className="flex gap-2">
            <div className="flex flex-col gap-2 w-full">
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
              {errors.sector && <p className="text-red-600 text-sm">{errors.sector.message}</p>}
            </div>

            <div className="flex flex-col gap-2 w-full">
              <Label>Programa al que aplica</Label>
              <Controller
                name="programaId"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder={"Selecciona un programa"} />
                    </SelectTrigger>
                    <SelectContent>
                      {programas.map((p) => (
                        <SelectItem key={p.id} value={String(p.id)}>
                          {p.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.programaId && (
                <p className="text-red-600 text-sm">{errors.programaId.message}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Descripción de la empresa</Label>
            <Controller
              name="descripcion"
              control={control}
              render={({ field }) => <Textarea {...field} placeholder="Describe brevemente la trayectoria y actividades principales de la empresa" />}
            />
            {errors.descripcion && <p className="text-red-600 text-sm">{errors.descripcion.message}</p>}
          </div>

          <Button type="button" onClick={nextStep} className="w-full bg-red-600 hover:bg-red-700">
            Siguiente
          </Button>
        </>
      )}
      {step === 1 && (
        <>
          {/* REPRESENTANTE LEGAL */}
          <div className="flex flex-col gap-2">
            <Label>Nombre completo</Label>
            <Controller name="representanteLegal.nombreCompleto" control={control} render={({ field }) => <Input {...field} placeholder="Pepito Pérez" />} />
            {errors.representanteLegal?.nombreCompleto && <p className="text-red-600 text-sm">{errors.representanteLegal?.nombreCompleto.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label>Tipo de documento</Label>
            <Controller
              name="representanteLegal.tipoDocumento"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger><SelectValue placeholder="Selecciona el tipo" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CC">Cédula</SelectItem>
                    <SelectItem value="NIT">NIT</SelectItem>
                    <SelectItem value="CE">Cédula de extranjería</SelectItem>
                    <SelectItem value="PA">Pasaporte</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.representanteLegal?.tipoDocumento && <p className="text-red-600 text-sm">{errors.representanteLegal.tipoDocumento.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label>Número de documento</Label>
            <Controller name="representanteLegal.numeroDocumento" control={control} render={({ field }) => <Input {...field} type="number" placeholder="1023456789" />} />
            {errors.representanteLegal?.numeroDocumento && <p className="text-red-600 text-sm">{errors.representanteLegal.numeroDocumento.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label>Teléfono</Label>
            <Controller name="representanteLegal.telefono" control={control} render={({ field }) => <Input {...field} type="tel" placeholder="+57 300 1122334" />} />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Correo</Label>
            <Controller name="representanteLegal.correo" control={control} render={({ field }) => <Input {...field} type="email" placeholder="rep@empresa.co" />} />
            {errors.representanteLegal?.correo && <p className="text-red-600 text-sm">{errors.representanteLegal.correo.message}</p>}
          </div>

          <div className="flex justify-between mt-4">
            <Button type="button" onClick={prevStep} variant="outline">Atrás</Button>
            <Button type="submit" disabled={isSubmitting} className="bg-red-600 hover:bg-red-700">
              {isSubmitting ? "Enviando..." : submitLabel}
            </Button>

          </div>

        </>
      )}

    </form>
  )
}
