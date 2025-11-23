

import { useNavigate } from "react-router"
import { ChevronLeft } from "lucide-react"

  import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAppDispatch } from "@/store/hooks"
import { companyApi } from "@/api/companyApi"
import { hideLoader, showLoader } from "@/store/slices/uiSlice"
import { toast } from "sonner"
import { CompanyForm } from "@/components/CompanyForm"
import type { IRegisterCompanyData } from "@/models/ICompany"

const CompanyRegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onSubmit = async (data: IRegisterCompanyData) => {
    try {
      dispatch(showLoader())

      await companyApi.register(data)
      toast.success("Solicitud enviada correctamente. Su empresa será revisada.")
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
          <CompanyForm onSubmit={onSubmit} submitLabel="Enviar solicitud" />
        </CardContent>

        <CardFooter />
      </Card>
    </div>
  )
}


export default CompanyRegisterPage;