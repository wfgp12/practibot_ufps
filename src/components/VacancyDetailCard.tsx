import type { Vacancy } from "@/models/IVacancy";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Briefcase, Clock } from "lucide-react";

interface VacancyDetailCardProps {
  vacancy: Vacancy;
}

export const VacancyDetailCard = ({ vacancy }: VacancyDetailCardProps) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-2xl">{vacancy.title}</CardTitle>
          <Badge variant={
            vacancy.status === "Open" ? "default" :
            vacancy.status === "Closed" ? "destructive" : "secondary"
          }>
            {vacancy.status}
          </Badge>
        </div>
        <CardDescription className="mt-2">{vacancy.company}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="flex items-center gap-2 text-gray-700">
          <MapPin className="w-4 h-4" /> {vacancy.location}
        </p>
        <p className="flex items-center gap-2 text-gray-700">
          <Briefcase className="w-4 h-4" /> {vacancy.modality}
        </p>
        <p className="flex items-center gap-2 text-gray-700">
          <Clock className="w-4 h-4" /> {vacancy.workday}
        </p>

        <div>
          <span className="font-semibold text-gray-800">Habilidades:</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {vacancy.skills.map((skill, idx) => (
              <Badge key={idx} variant="outline">{skill}</Badge>
            ))}
          </div>
        </div>

        {vacancy.description && (
          <p className="text-gray-600 mt-2">{vacancy.description}</p>
        )}
      </CardContent>
    </Card>
  );
};
