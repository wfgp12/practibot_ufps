import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, SectionComponent } from "@/components";
import { useNavigate, useParams } from "react-router";
import type { Agreement } from "@/models/IAgreement";
import { toast } from "sonner";
import { useAgreement } from "@/hooks/useAgreement";
import { useAppSelector } from "@/store/hooks";
import { useForm } from "react-hook-form";

interface Comment {
    id: string;
    author: "Empresa" | "Directora";
    timestamp: string;
    message: string;
}

export const AgreementRequest: React.FC = () => {
    const user = useAppSelector((state) => state.auth.user);
    const role = user?.role;
    const navigate = useNavigate();
    const { id } = useParams();

    const { agreement, templateUrl, loading, error, fetchAgreement, createAgreement, uploadSignedAgreement, sendForFinalReview } = useAgreement(id ? Number(id) : null);

    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");

    // Enviar comentario (chat)
    const handleSendComment = () => {
        if (!newComment.trim()) return;
        const newMsg: Comment = {
            id: Date.now().toString(),
            author: "Empresa",
            timestamp: new Date().toLocaleString(),
            message: newComment.trim(),
        };
        setComments((prev) => [...prev, newMsg]);
        setNewComment("");
        // Aquí luego se integrará el POST a tu API de comentarios
    };

    if (loading) {
        return (
            <SectionComponent classNameContainer="py-10" classNameContent="max-w-5xl">
                <p className="text-center text-muted-foreground">Cargando convenio...</p>
            </SectionComponent>
        );
    }

    if (error) {
        return (
            <SectionComponent classNameContainer="py-10" classNameContent="max-w-5xl">
                <p className="text-center text-red-600">{error}</p>
            </SectionComponent>
        );
    }

    const company = agreement?.company;
    const isReadOnly = agreement && ["Aprobado", "Vencido", "Rechazado"].includes(agreement.status);

    return (
        <SectionComponent classNameContainer="py-5" classNameContent="max-w-6xl">
            <div className="p-4 space-y-6 w-full">
                {/* Header */}
                <div className="flex justify-between items-center border-b pb-2">
                    <div>
                        <h1 className="text-xl font-semibold">Solicitud y seguimiento de convenio</h1>
                        <p className="text-sm text-gray-500">{company?.nombre}</p>
                    </div>
                    <Button variant="outline" onClick={() => navigate("/dashboard")}>
                        Volver al panel
                    </Button>
                </div>

                {/* Estado */}
                {agreement ? (
                    <Badge
                        variant="outline"
                        className={`px-4 ${agreement.status === "Aprobado"
                            ? "bg-green-100 border-green-300 text-green-700"
                            : agreement.status === "Rechazado"
                                ? "bg-red-100 border-red-300 text-red-700"
                                : agreement.status === "Vencido"
                                    ? "bg-gray-100 border-gray-300 text-gray-700"
                                    : "bg-amber-100 border-amber-300 text-amber-700"
                            }`}
                    >
                        {agreement.status}
                    </Badge>
                ) : (
                    <Badge
                        variant="outline"
                        className="px-4 bg-blue-100 border-blue-300 text-blue-700"
                    >
                        🆕 Primer convenio
                    </Badge>
                )}

                <div className="grid grid-cols-12 gap-6">
                    {/* Columna izquierda: PDF */}
                    <div className="col-span-7 border rounded p-4 flex flex-col gap-4">
                        {loading ? (
                            <div className="animate-pulse space-y-4">
                                <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                                <div className="h-[600px] bg-gray-200 rounded"></div>
                            </div>
                        ) : (
                            <iframe
                                src={
                                    agreement?.fileUrl ||
                                    templateUrl || ""
                                }
                                title="Convenio PDF"
                                className="flex-1 w-full h-[600px] border rounded"
                            ></iframe>
                        )}
                        {/* Acciones */}
                        {agreement ? (
                            !isReadOnly && (
                                <>
                                    {role === "EMPRESA" && (
                                        <AgreementActionsEmpresa
                                            agreement={agreement}
                                            onUpdate={fetchAgreement}
                                            templateUrl={templateUrl}
                                            uploadSignedAgreement={uploadSignedAgreement}
                                            sendForFinalReview={sendForFinalReview}
                                        />
                                    )}

                                    {(role === "DIRECTOR" || role === "ADMIN") && (
                                        <AgreementActionsDirector
                                            agreement={agreement}
                                            onUpdate={fetchAgreement}
                                        />
                                    )}
                                </>
                            )
                        ) : (
                            <Button
                                className="mt-2 bg-zinc-500 hover:bg-zinc-600 text-white"
                                disabled={loading}
                                onClick={async () => {
                                    try {
                                        const newAgreement = await createAgreement();
                                        if (!newAgreement) throw new Error("No se creó el convenio");

                                        toast.success("convenio iniciado correctamente.");
                                        navigate(`/dashboard/agreement/${newAgreement.id}`);
                                    } catch (err) {
                                        console.error(err);
                                        toast.error("Error al iniciar el convenio");
                                    }
                                }}
                            >
                                Iniciar proceso de convenio
                            </Button>
                        )}

                        {agreement?.status === "Aprobado" && (
                            <span className="text-green-600 font-semibold mt-2">Convenio activo ✅</span>
                        )}
                        {agreement?.status === "Vencido" && (
                            <span className="text-gray-600 font-semibold mt-2">Convenio vencido ⏰</span>
                        )}
                    </div>

                    {/* Columna derecha: Chat */}
                    <div className="col-span-5 border rounded p-4 flex flex-col h-[600px]">
                        <div className="flex-1 overflow-y-auto space-y-4">
                            {comments.length === 0 ? (
                                <p className="text-sm text-gray-400 text-center mt-4">
                                    No hay comentarios aún.
                                </p>
                            ) : (
                                comments.map((c) => (
                                    <div key={c.id} className="flex gap-2 items-start">
                                        <div>
                                            <div className="flex gap-2 items-center">
                                                <span className="font-semibold">{c.author}</span>
                                                <span className="text-xs text-gray-500">{c.timestamp}</span>
                                            </div>
                                            <p className="text-gray-700">{c.message}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Input comentario */}
                        {!isReadOnly && (
                            <div className="mt-2 flex gap-2 items-center">
                                <Input
                                    placeholder="Escribe un comentario..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                />
                                <Button onClick={handleSendComment}>Enviar</Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </SectionComponent>
    );
};

const AgreementActionsEmpresa  = ({
    agreement,
    onUpdate,
    templateUrl,
    uploadSignedAgreement,
    sendForFinalReview,
}: {
    agreement: Agreement;
    onUpdate: () => void,
    templateUrl?: string | null;
    uploadSignedAgreement: (file: File) => Promise<Agreement | undefined>;
    sendForFinalReview: () => Promise<Agreement | undefined>;
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUploadClick = () => fileInputRef.current?.click();

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            await uploadSignedAgreement(file);
            toast.success("Versión firmada subida correctamente. Lista para revisión final.");
            onUpdate();
        } catch {
            toast.error("Error al subir la versión firmada.");
        }
    };

    const handleSendForReview = async () => {
        try {
            await sendForFinalReview();
            toast.success("Convenio enviado para revisión final.");
            onUpdate();
        } catch {
            toast.error("No se pudo enviar el convenio para revisión final.");
        }
    };

    const canSendForReview =
        !!agreement.fileUrl &&
        ["Pendiente de revisión"].includes(agreement.status);

    return (
        <div className="flex flex-col gap-3">
            <div className="flex gap-2 flex-wrap">
                <a
                    href={agreement?.fileUrl || templateUrl || ""}
                    download={agreement ? `Convenio_${agreement.id}.pdf` : "Plantilla_Convenio.pdf"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                >
                    Descargar
                </a>
                <Button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors" onClick={handleUploadClick}>Subir versión firmada</Button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={handleFileChange}
                />
            </div>

            <Button
                className={`mt-2 ${canSendForReview
                    ? "bg-zinc-500 hover:bg-zinc-600"
                    : "bg-gray-300 cursor-not-allowed"
                    } text-white`}
                disabled={!canSendForReview}
                onClick={handleSendForReview}
            >
                Enviar para revisión final
            </Button>
        </div>
    );
};


interface ApproveFormValues {
  fechaInicio: string;
  fechaFin: string;
  observaciones?: string;
  file: FileList;
}

export const AgreementActionsDirector = ({
  agreement,
  onUpdate,
}: {
  agreement: Agreement;
  onUpdate: () => void;
}) => {
  const { approveAgreement, rejectAgreement } = useAgreement(agreement.id);
  const [open, setOpen] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, watch } = useForm<ApproveFormValues>();
  const file = watch("file")?.[0];

  const onSubmit = async (values: ApproveFormValues) => {
    if (!values.file?.length) {
      toast.error("Debes subir el convenio firmado final");
      return;
    }
    setLoading(true);
    try {
      await approveAgreement(values.file[0], {
        fechaInicio: values.fechaInicio,
        fechaFin: values.fechaFin,
        observaciones: values.observaciones,
      });
      toast.success("Convenio aprobado correctamente ✅");
      reset();
      onUpdate();
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Error al aprobar el convenio");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!confirm("¿Seguro que quieres rechazar este convenio?")) return;
    setRejecting(true);
    try {
      await rejectAgreement();
      toast.warning("Convenio rechazado ❌");
      onUpdate();
    } catch {
      toast.error("Error al rechazar el convenio");
    } finally {
      setRejecting(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 mt-3 border-t pt-4">
      <h3 className="font-semibold text-gray-700">Revisión del convenio</h3>

      <div className="flex gap-2">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              Aprobar convenio
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Aprobación del convenio</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Archivo firmado
                </label>
                <Input
                  type="file"
                  accept="application/pdf"
                  {...register("file")}
                />
                {file && (
                  <p className="text-xs text-gray-500 mt-1">
                    {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de inicio
                  </label>
                  <Input type="date" {...register("fechaInicio", { required: true })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de fin
                  </label>
                  <Input type="date" {...register("fechaFin", { required: true })} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observaciones (opcional)
                </label>
                <Input
                  placeholder="Notas o comentarios..."
                  {...register("observaciones")}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {loading ? "Aprobando..." : "Confirmar aprobación"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Button
          onClick={handleReject}
          disabled={rejecting}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          {rejecting ? "Rechazando..." : "Rechazar convenio"}
        </Button>
      </div>
    </div>
  );
};
