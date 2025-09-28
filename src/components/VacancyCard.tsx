import { MapPin, Clock, Building2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"

interface VacancyCardProps {
  title: string
  company: string
  location: string
  modality: string
  workday: string
  skills: string[]
  onClick: () => void
}

export const VacancyCard = ({ 
  title, 
  company, 
  location, 
  modality, 
  workday, 
  skills = [], 
  onClick 
} : VacancyCardProps) => {
  return (
    <Card className="w-[300px]">
      <CardHeader className="flex flex-row justify-between items-start">
        <div>
          <CardTitle className="truncate whitespace-nowrap max-w-[165px]">{title}</CardTitle>
          <CardDescription className="flex items-center gap-1">
            <Building2 size={16} /> {company}
          </CardDescription>
        </div>
        <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
          {modality}
        </span>
      </CardHeader>

      <CardContent className="space-y-2">
        <p className="flex items-center gap-2 text-sm text-gray-700">
          <MapPin size={16} /> {location}
        </p>
        <p className="flex items-center gap-2 text-sm text-gray-700">
          <Clock size={16} /> {workday}
        </p>

        <div className="flex flex-wrap gap-2 mt-4">
          {skills.map((skill, idx) => (
            <Badge  
              key={idx} 
              variant="outline"
            >
              {skill}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter>
        <Button onClick={onClick} className="w-full bg-red-500 hover:bg-red-700 cursor-pointer transform transition-transform duration-300 hover:scale-110">
          Ver detalle
        </Button>
      </CardFooter>
    </Card>
  )
}
