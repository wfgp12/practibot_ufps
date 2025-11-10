import { SectionComponent } from "@/components/SectionComponent"
import { GestionConvenios } from "./components/GestionConvenios"
import { GestionVacantes } from "./components/GestionVacantes"
import { GestionDocumentos } from "./components/GestionDocumentos"
// import { GestionEstudiantes } from "./components/GestionEstudiantes"
// import { GestionDocumentos } from "./components/GestionDocumentos"
// import { QuickReports } from "./components/QuickReports"

export const AdminDashboard = () => {


    return (
        <>
            <SectionComponent classNameContainer="pt-10 pb-5" classNameContent="max-w-6xl" id="convenios">
                <GestionConvenios />
            </SectionComponent>
            <SectionComponent classNameContainer="py-10" classNameContent="max-w-6xl" id="vacantes">
                <GestionVacantes/>
            </SectionComponent>
            <SectionComponent classNameContainer="py-10" classNameContent="max-w-6xl" id="documentos">
                <GestionDocumentos/>
            </SectionComponent>
            {/* <SectionComponent classNameContainer="py-10" classNameContent="max-w-6xl" id="estudiantes">
                <GestionEstudiantes/>
            </SectionComponent>
            <SectionComponent classNameContainer="py-10" classNameContent="max-w-6xl" id="reportes">
                <QuickReports/>
            </SectionComponent> */}
        </>
    )
}
