import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge, SectionComponent } from "@/components";
import { useNavigate, useParams } from "react-router";
import type { Agreement } from "@/models/IAgreement";
import axios from "axios";
import { toast } from "sonner";
import { useAgreement } from "@/hooks/useAgreement";

interface Comment {
    id: string;
    author: "Empresa" | "Directora";
    timestamp: string;
    message: string;
}

export const AgreementRequest: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const { agreement, loading, error, fetchAgreement } = useAgreement(id ? Number(id) : null);

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
                        <iframe
                            src={
                                agreement?.fileUrl ||
                                "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
                            }
                            title="Convenio PDF"
                            className="flex-1 w-full h-[600px] border rounded"
                        ></iframe>

                        {/* Acciones */}
                        {agreement ? (
                            !isReadOnly && (
                                <AgreementActions
                                    agreement={agreement}
                                    onUpdate={fetchAgreement}
                                />
                            )
                        ) : (
                            <Button
                                className="mt-2 bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={() => {
                                    toast.success("Simulación: convenio iniciado correctamente.");
                                    navigate("/dashboard/agreement/123"); // simula redirección
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

// ---- Subcomponente de acciones (descargar / subir / enviar) ----
const AgreementActions = ({
    agreement,
    onUpdate,
}: {
    agreement: Agreement;
    onUpdate: () => void
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = agreement.fileUrl || "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
        link.download = "Convenio_Practicas.pdf";
        link.click();
    };

    const handleUploadClick = () => fileInputRef.current?.click();

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            const formData = new FormData();
            formData.append("file", file);

            await axios.post(`/api/convenios/${agreement.id}/subir-firmado`, formData);

            toast.success("Versión firmada subida correctamente. Lista para revisión final.");

            // recarga el convenio con datos actualizados
            onUpdate();
        } catch (err) {
            console.error(err);
            toast.error("Error al subir la versión firmada.");
        }
    };

    const handleSendForReview = async () => {
        try {
            await axios.post(`/api/convenios/${agreement.id}/enviar-revision-final`);

            toast.success("Convenio enviado para revisión final.");

            // recarga el convenio con datos actualizados
            onUpdate();
        } catch (err) {
            console.error(err);
            toast.error("No se pudo enviar el convenio para revisión final.");
        }
    };

    return (
        <div className="flex flex-col gap-3">
            <div className="flex gap-2 flex-wrap">
                <Button onClick={handleDownload}>Descargar</Button>
                <Button onClick={handleUploadClick}>Subir versión firmada</Button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={handleFileChange}
                />
            </div>

            {agreement.fileUrl && (
                <Button
                    className="mt-2 bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={handleSendForReview}
                >
                    Enviar para revisión final
                </Button>
            )}
        </div>
    );
};
