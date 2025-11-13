import { SectionComponent } from "@/components"
import { ProfileCard } from "./components/student/ProfileCard"
import { VacanciesList } from "./components/vancancy/VacanciesList"

export const StudentDashboard = () => {

  return (
    <div>
      <SectionComponent classNameContainer="pb-5" classNameContent="max-w-6xl" id="perfil">
        <ProfileCard />
      </SectionComponent>
      <SectionComponent  classNameContent="max-w-6xl" id="vacantes">
        <VacanciesList />
      </SectionComponent>
    </div>
  )
}
