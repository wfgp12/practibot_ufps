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

interface CargarMasivoProps {
    title: string;
    buttonLabel: string;
    showPdfSection?: boolean;
    handleSubmit: (excelFile: File, pdfFiles: File[]) => Promise<void>;
}

export const CargarMasivoModal = ({
    title,
    buttonLabel,
    showPdfSection = false,
    handleSubmit
}: CargarMasivoProps) => {
    const excelRef = useRef<HTMLInputElement>(null);
    const pdfsRef = useRef<HTMLInputElement>(null);

    const [excelFile, setExcelFile] = useState<File | null>(null);
    const [pdfFiles, setPdfFiles] = useState<File[]>([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const reset = () => {
        setExcelFile(null);
        setPdfFiles([]);
        if (excelRef.current) {
            excelRef.current.value = "";
        }
        if (pdfsRef.current) {
            pdfsRef.current.value = "";
        }
    };

    const handleUpload = async () => {
        if (!excelFile) return;

        setLoading(true);
        try {
            await handleSubmit(excelFile, pdfFiles);
            setOpen(false);
            reset();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) setExcelFile(droppedFile);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                    <Upload size={18} />
                    {buttonLabel}
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
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
                        ref={excelRef}
                        type="file"
                        hidden
                        accept=".csv,.xlsx"
                        onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) setExcelFile(f);
                        }}
                    />
                </div>

                {excelFile && (
                    <p className="text-sm mt-3 text-center text-green-600">
                        Archivo seleccionado: <strong>{excelFile.name}</strong>
                    </p>
                )}

                {showPdfSection && (
                    <div className="mb-4">
                        <p className="font-medium mb-1">Archivos PDF</p>
                        <input
                            ref={pdfsRef}
                            type="file"
                            accept="application/pdf"
                            multiple
                            onChange={(e) => {
                                const fs = e.target.files;
                                if (fs) setPdfFiles(Array.from(fs));
                            }}
                            className="border rounded p-2 w-full"
                        />

                        {pdfFiles.length > 0 && (
                            <p className="text-sm text-green-600 mt-1">
                                {pdfFiles.length} archivo(s)
                            </p>
                        )}
                    </div>
                )}

                <DialogFooter>
                    <Button
                        onClick={handleUpload}
                        disabled={
                            !excelFile ||
                            loading ||
                            (showPdfSection && pdfFiles.length === 0)
                        }
                        className="w-full"
                    >
                        {loading ? "Cargando..." : "Procesar archivo"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
