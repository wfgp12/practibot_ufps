// src/pages/estudiantes/CargarMasivoModal.tsx
import { useRef, useState } from "react";
import { Button } from "@/components";
import { Upload } from "lucide-react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { useStudents } from "@/hooks/useStudents";

export const CargarMasivoModal = ({ onSuccess }: { onSuccess?: () => void }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { cargarMasivo } = useStudents();
    const [file, setFile] = useState<File | null>(null);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleUpload = async () => {
        if (!file) return;

        setLoading(true);
        try {
            await cargarMasivo(file);
            onSuccess?.();
            setOpen(false);
            setFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = ""; 
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) setFile(droppedFile);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                    <Upload size={18} />
                    Cargar estudiantes
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Carga masiva de estudiantes</DialogTitle>
                </DialogHeader>

                <div
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:bg-zinc-50 transition"
                    onClick={() => document.getElementById("input-file")?.click()}
                >
                    <Upload size={40} className="mx-auto text-zinc-600 mb-2" />
                    <p className="text-zinc-700">
                        Arrastra tu archivo aquí o haz click para seleccionar
                    </p>
                    <p className="text-xs text-zinc-500 mt-1">
                        Formatos permitidos: CSV y Excel (.xlsx)
                    </p>

                    <input
                        id="input-file"
                        ref={fileInputRef}
                        type="file"
                        hidden
                        accept=".csv,.xlsx"
                        onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) setFile(f);
                        }}
                    />
                </div>

                {file && (
                    <p className="text-sm mt-3 text-center text-green-600">
                        Archivo seleccionado: <strong>{file.name}</strong>
                    </p>
                )}

                <DialogFooter>
                    <Button
                        onClick={handleUpload}
                        disabled={!file || loading}
                        className="w-full"
                    >
                        {loading ? "Cargando..." : "Procesar archivo"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
