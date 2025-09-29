import { SectionComponent } from "@/components/SectionComponent";
import { VacancyCard } from "@/components/VacancyCard";
import { useVacancies } from "@/hooks/useVacancies"
import { Search, FileText, ChartColumnIncreasing } from "lucide-react"
import { useNavigate } from "react-router";

const steps = [
  {
    icon: <Search className="w-10 h-10" />,
    title: '1. Buscar',
    description: 'Explora vacantes de práctica filtradas por tu perfil, intereses y ubicación.',
  },
  {
    icon: <FileText className="w-10 h-10" />,
    title: '2. Postular',
    description: 'Envía tu CV y carta de aceptación directamente a las empresas que te interesan.',
  },
  {
    icon: <ChartColumnIncreasing className="w-10 h-10" />,
    title: '3. Hacer seguimiento',
    description: 'Mantén tu estado actualizado y recibe retroalimentación en el proceso de selección.',
  }
]

export const HomePage = () => {
  const { vacancies } = useVacancies();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      <SectionComponent>
        <h1 className="text-4xl font-bold text-center">
          Practicas UFPS: orientación y gestión en un solo lugar
        </h1>
        <p className="text-center text-xl">
          Encuentra y gestiona tus prácticas con apoyo del chatbot UFPS. Conectamos estudiantes de Ingeniería de Sistemas con las mejores oportunidades.
        </p>
        <div className="w-full flex justify-center items-center gap-4">
          <a href="#vacantes" className="bg-gray-400 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transform transition-transform duration-300 hover:scale-110">
            Explora vacantes
          </a>
          <a href="/login" className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transform transition-transform duration-300 hover:scale-110">
            Acceder
          </a>
        </div>
      </SectionComponent>

      <SectionComponent
        classNameContainer="bg-white"
      >
        <h2 className="text-3xl font-bold text-center mb-8">¿Como funciona?</h2>
        <div className="grid grid-cols-1  lg:grid-cols-3 gap-8 ">
          {steps.map((step, index) => (
            <div key={index} className="p-6 flex flex-col items-center text-center">
              {step.icon}
              <h3 className="text-xl font-semibold mt-5">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </SectionComponent>

      <SectionComponent
        classNameContent="max-w-5xl"
      >
        <h2 className="text-3xl font-bold text-center mb-8">
          Vacantes Destacadas
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {
            vacancies.map((vacancy, idx) => (
              <VacancyCard
                key={idx}
                title={vacancy.title}
                company={vacancy.company}
                location={vacancy.location}
                modality={vacancy.modality}
                workday={vacancy.workday}
                skills={vacancy.skills}
                onClick={() => navigate(`/login`)}
              />
            ))
          }
        </div>
      </SectionComponent>

      <SectionComponent
        classNameContainer="bg-white"
      >
        <h2 className="text-3xl font-bold text-center ">
          ¿Eres una empresa?
        </h2>
        <p className="text-center">
          Solicita un convenio y publica tus vacantes de prácticas en pocos pasos.
        </p>
        <div className="w-full flex justify-center items-center gap-4 mt-6">
          <a href="/registro-empresa" className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transform transition-transform duration-300 hover:scale-110">
            Solicitar convenio
          </a>
        </div>
      </SectionComponent>
    </div>
  )
}
