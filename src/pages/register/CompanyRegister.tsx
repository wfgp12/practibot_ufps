

import { useState } from "react"
import { useNavigate } from "react-router"
import { ChevronLeft } from "lucide-react"

import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

export const CompanyRegister = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    nombreEmpresa: "",
    nit: "",
    correo: "",
    telefono: "",
    direccion: "",
    sector: "",
    descripcion: "",
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Datos enviados:", formData)
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
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Nombre empresa */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="nombreEmpresa">Nombre de la empresa</Label>
              <Input
                id="nombreEmpresa"
                placeholder="Ej: Tecnologías XYZ"
                value={formData.nombreEmpresa}
                onChange={(e) => handleChange("nombreEmpresa", e.target.value)}
              />
            </div>

            {/* NIT */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="nit">NIT</Label>
              <Input
                id="nit"
                placeholder="900123456-7"
                value={formData.nit}
                onChange={(e) => handleChange("nit", e.target.value)}
              />
            </div>

            {/* Correo */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="correo">Correo de contacto</Label>
              <Input
                id="correo"
                type="email"
                placeholder="contacto@empresa.co"
                value={formData.correo}
                onChange={(e) => handleChange("correo", e.target.value)}
              />
            </div>

            {/* Teléfono */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="telefono">Teléfono de contacto</Label>
              <Input
                id="telefono"
                type="tel"
                placeholder="+57 300 123 4567"
                value={formData.telefono}
                onChange={(e) => handleChange("telefono", e.target.value)}
              />
            </div>

            {/* Dirección */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Input
                id="direccion"
                placeholder="Cl 10 #1 - 23, Cúcuta"
                value={formData.direccion}
                onChange={(e) => handleChange("direccion", e.target.value)}
              />
            </div>

            {/* Sector */}
            <div className="flex flex-col gap-2">
              <Label>Sector empresarial</Label>
              <Select onValueChange={(value) => handleChange("sector", value)}>
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
            </div>

            {/* Descripción */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="descripcion">Descripción de la empresa</Label>
              <Textarea
                id="descripcion"
                placeholder="Describe brevemente la trayectoria y actividades principales de la empresa"
                value={formData.descripcion}
                onChange={(e) => handleChange("descripcion", e.target.value)}
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
