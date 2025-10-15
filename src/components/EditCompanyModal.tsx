import { useState } from "react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CompanyForm } from "./CompanyForm"
import { toast } from "sonner"
import type { ICompany } from "@/models/ICompany"
import { companyApi } from "@/api/companyApi"

interface EditCompanyDialogProps {
  company: ICompany
  onUpdated: (updated: ICompany) => void
}

export const EditCompanyDialog = ({ company, onUpdated }: EditCompanyDialogProps) => {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false) 

  const handleSubmit = async (data: Parameters<typeof companyApi.register>[0]) => {
    setLoading(true)
    try {
      const updated = await companyApi.update(company.id, data)
      toast.success("Empresa actualizada correctamente")
      onUpdated(updated)

      setOpen(false)

    } catch (error: unknown) {
      if (error instanceof Error) toast.error(error.message)
      else toast.error("Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Editar</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar empresa</DialogTitle>
          <DialogDescription>
            Modifica la información de la empresa y guarda los cambios.
          </DialogDescription>
        </DialogHeader>
        <CompanyForm
          defaultValues={{
            nombreEmpresa: company.nombre,
            correo: company.correo,
            nit: company.nit,
            telefono: company.telefono,
            direccion: company.direccion,
            sector: company.sector,
            descripcion: company.descripcion,
          }}
          onSubmit={handleSubmit}
          submitLabel={loading ? "Actualizando..." : "Actualizar"}
        />
      </DialogContent>
    </Dialog>
  )
}
