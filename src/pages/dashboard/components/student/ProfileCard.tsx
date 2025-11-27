import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { StudentProfileModal } from "./StudentProfileModal";
import { useStudent } from "@/hooks/useStudent";
import {
  Mail,
  User,
  IdCard,
  Hash,
  Briefcase,
  Activity,
  Phone,
  FileText,
  Wrench,
  Users,
  Layers,
  Eye,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { FileUploadModal } from "@/components/FileUpload";

export const ProfileCard = () => {
  const { student, completeProfile, updateStudent, uploadResume, fetchStudent, loading } = useStudent(undefined);

  if (loading) {
    return (
      <Card className="border border-zinc-200 shadow-sm w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="w-5 h-5 rounded-full bg-zinc-300" />
            <Skeleton className="h-5 w-48 bg-zinc-300" />
          </div>
          <Skeleton className="h-8 w-32 rounded-md bg-zinc-300" />
        </CardHeader>

        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 mt-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="w-4 h-4 rounded-full bg-zinc-300" />
              <Skeleton className="h-4 w-40 bg-zinc-300" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!student)
    return (
      <Card className="border border-zinc-200 shadow-sm w-full">
        <CardContent className="p-6 text-center text-zinc-500">
          No hay estudiante seleccionado
        </CardContent>
      </Card>
    );

  return (
    <Card className="border border-zinc-200 shadow-sm w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-800 flex items-center gap-2">
          <User className="w-5 h-5 text-red-600" />
          Mi perfil de practicante
        </h2>

        <div className="flex items-center gap-2">
          {student.profileComplete && (
            <>
              <FileUploadModal
                title={student.hojaDeVidaUrl ? "Actualizar Hoja de Vida" : "Subir Hoja de Vida"}
                buttonLabel={student.hojaDeVidaUrl ? "Actualizar Hoja de Vida" : "Subir Hoja de Vida"}
                accept=".pdf,.doc,.docx"
                handleSubmit={async (file) => {
                  await uploadResume(file);
                  await fetchStudent();
                }}
              />
              {student.hojaDeVidaUrl && (
                <a
                  href={student.hojaDeVidaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-zinc-600 px-3 py-1.5 rounded-md text-sm hover:bg-zinc-800 transition text-white"
                >
                  <Eye className="w-4 h-4 text-white-500" />
                  Ver Hoja de Vida
                </a>
              )}
            </>
          )}
          <StudentProfileModal
            student={student}
            onSave={student.profileComplete ? updateStudent : completeProfile}
          />
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm text-zinc-700">
        <p className="flex items-center gap-2">
          <User className="w-4 h-4 text-red-500" />
          <span className="font-bold">Nombre:</span> {student.name}
        </p>

        <p className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-red-500" />
          <span className="font-bold">Correo:</span> {student.email}
        </p>

        <p className="flex items-center gap-2">
          <Hash className="w-4 h-4 text-red-500" />
          <span className="font-bold">Código:</span> {student.code || "—"}
        </p>

        <p className="flex items-center gap-2">
          <IdCard className="w-4 h-4 text-red-500" />
          <span className="font-bold">Cédula:</span> {student.document || "—"}
        </p>

        <p className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-red-500" />
          <span className="font-bold">Área:</span> {student.area || "Sin asignar"}
        </p>

        <p className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-red-500" />
          <span className="font-bold">Estado:</span>{" "}
          <span
            className={`${student.active ? "text-green-600" : "text-zinc-500"
              } font-semibold`}
          >
            {student.active ? "Activo" : "Inactivo"}
          </span>
        </p>
      </CardContent>

      <div className="border-t border-zinc-200 px-6 py-4">
        <h3 className="text-base font-semibold text-zinc-800 mb-2 flex items-center gap-2">
          <FileText className="w-4 h-4 text-red-500" />
          Información adicional
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm text-zinc-700">
          <p className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-red-500" />
            <span className="font-bold">Teléfono:</span>{" "}
            {student.phone || "—"}
          </p>

          <p className="flex items-center gap-2 col-span-2 sm:col-span-1">
            <Wrench className="w-4 h-4 text-red-500" />
            <span className="font-bold">Habilidades técnicas:</span>{" "}
            {student.technicalSkills?.length
              ? student.technicalSkills.join(", ")
              : "—"}
          </p>

          <p className="flex items-center gap-2 col-span-2 sm:col-span-1">
            <Users className="w-4 h-4 text-red-500" />
            <span className="font-bold">Habilidades blandas:</span>{" "}
            {student.softSkills?.length
              ? student.softSkills.join(", ")
              : "—"}
          </p>

          <p className="flex items-center gap-2 col-span-2">
            <Layers className="w-4 h-4 text-red-500" />
            <span className="font-bold">Experiencia:</span>{" "}
            {student.experience || "—"}
          </p>

          <p className="col-span-2 text-zinc-600 text-sm leading-relaxed">
            <span className="font-bold text-zinc-800">Descripción:</span>{" "}
            {student.perfilProfesional || (
              <span className="text-zinc-500 italic">
                Sin descripción personal
              </span>
            )}
          </p>
        </div>
      </div>
    </Card>
  );
};
