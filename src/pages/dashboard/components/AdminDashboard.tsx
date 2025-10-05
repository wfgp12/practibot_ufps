import { SectionComponent } from "@/components/SectionComponent"
import { GestionConvenios } from "./GestionConvenios"
import { GestionVacantes } from "./GestionVacantes"

export const AdminDashboard = () => {


    return (
        <>
            <SectionComponent classNameContainer="pt-10 pb-5" classNameContent="max-w-6xl" id="convenios">
                <GestionConvenios />
            </SectionComponent>
            <SectionComponent classNameContainer="py-10" classNameContent="max-w-6xl" id="vacantes">
                <GestionVacantes/>
            </SectionComponent>
            <SectionComponent classNameContainer="py-10" classNameContent="max-w-6xl" id="usuarios">
                <></>
            </SectionComponent>
            <SectionComponent classNameContainer="py-10" classNameContent="max-w-6xl" id="estudiantes">
                <></>
            </SectionComponent>
            <SectionComponent classNameContainer="py-10" classNameContent="max-w-6xl" id="documentos">
                <></>
            </SectionComponent>
            <SectionComponent classNameContainer="py-10" classNameContent="max-w-6xl" id="reportes">
                <></>
            </SectionComponent>
        </>
    )
}
