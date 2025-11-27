import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { StudentModal } from "./StudentModal";
import { FileUploadModal } from "@/components/FileUpload";
import { useStudent } from "@/hooks/useStudent";
import { Eye, User, Mail, Hash, IdCard, Briefcase, Activity, Phone, Layers, Users, Wrench, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { SectionComponent, Skeleton } from "@/components";

export const StudentDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { student, fetchStudent, uploadResume, loading } = useStudent(Number(id));
    const [showResume, setShowResume] = useState(false);

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

  console.log('student', student);
    if (!student) return <p>No hay estudiante seleccionado</p>;

    return (
        <SectionComponent classNameContent="max-w-6xl" classNameContainer="pt-0">
            <div className="w-full mb-4">
                <button
                    className="flex items-center gap-2 text-gray-400 px-4 py-2 rounded duration-200 hover:gap-3 transition-all hover:bg-[#e4e2e2] hover:scale-105 hover:-translate-x-1"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft size={24} /> Volver
                </button>
            </div>
            <Card className="w-full">
                <CardHeader className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <User className="w-5 h-5 text-red-600" />
                        Detalle de estudiante
                    </h2>
                    <div className="flex items-center gap-2">
                        <StudentModal student={student} onSuccess={fetchStudent} />
                        {student.hojaDeVidaUrl && student.hojaDeVidaUrl !== "" && (
                            <button
                                className="flex items-center gap-2 bg-zinc-600 px-3 py-1.5 rounded-md text-white hover:bg-zinc-800 transition"
                                onClick={() => setShowResume(!showResume)}
                            >
                                <Eye className="w-4 h-4" />
                                {showResume ? "Ocultar Hoja de Vida" : "Mostrar Hoja de Vida"}
                            </button>
                        )}
                        <FileUploadModal
                            title={student.hojaDeVidaUrl ? "Actualizar Hoja de Vida" : "Subir Hoja de Vida"}
                            buttonLabel={student.hojaDeVidaUrl ? "Actualizar Hoja de Vida" : "Subir Hoja de Vida"}
                            accept=".pdf,.doc,.docx"
                            handleSubmit={async (file) => {
                                await uploadResume(file);
                                await fetchStudent();
                            }}
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
                        <span className={`${student.active ? "text-green-600" : "text-zinc-500"} font-semibold`}>
                            {student.active ? "Activo" : "Inactivo"}
                        </span>
                    </p>

                    <p className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-red-500" />
                        <span className="font-bold">Teléfono:</span> {student.phone || "—"}
                    </p>

                    <p className="flex items-center gap-2 col-span-2 sm:col-span-1">
                        <Wrench className="w-4 h-4 text-red-500" />
                        <span className="font-bold">Habilidades técnicas:</span>{" "}
                        {student.technicalSkills?.length ? student.technicalSkills.join(", ") : "—"}
                    </p>

                    <p className="flex items-center gap-2 col-span-2 sm:col-span-1">
                        <Users className="w-4 h-4 text-red-500" />
                        <span className="font-bold">Habilidades blandas:</span>{" "}
                        {student.softSkills?.length ? student.softSkills.join(", ") : "—"}
                    </p>

                    <p className="flex items-center gap-2 col-span-2">
                        <Layers className="w-4 h-4 text-red-500" />
                        <span className="font-bold">Experiencia:</span> {student.experience || "—"}
                    </p>
                </CardContent>

                {showResume && student.hojaDeVidaUrl && (
                    <div className="mt-4 border-t border-zinc-200 pt-4">
                        <iframe
                            src={student.hojaDeVidaUrl}
                            title="Hoja de Vida"
                            className="w-full h-96 border"
                        />
                    </div>
                )}
            </Card>
        </SectionComponent>
    );
};
