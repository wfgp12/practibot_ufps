import { SectionComponent } from "@/components/SectionComponent"
import { GestionConvenios } from "./GestionConvenios"

export const AdminDashboard = () => {


    return (
        <>
            <SectionComponent id="convenios">
                <GestionConvenios />
            </SectionComponent>
            <SectionComponent id="vacantes">
                <></>
            </SectionComponent>
            <SectionComponent id="usuarios">
                <></>
            </SectionComponent>
            <SectionComponent id="estudiantes">
                <></>
            </SectionComponent>
            <SectionComponent id="documentos">
                <></>
            </SectionComponent>
            <SectionComponent id="reportes">
                <></>
            </SectionComponent>
        </>
    )
}
