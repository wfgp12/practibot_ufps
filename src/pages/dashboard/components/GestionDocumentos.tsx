import { useForm, type SubmitHandler } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useDocuments } from "@/hooks/useDocuments";

type FormValues = {
    categoria: string;
    titulo: string;
    descripcion: string;
    archivo: FileList;
};

export const GestionDocumentos = () => {
    const { documents, addDocument, removeDocument } = useDocuments();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>();

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        try {
            const file = data.archivo[0];
            if (!file) return;

            // Aquí luego conectas Cloudinary o S3
            addDocument({
                title: data.titulo,
                category: data.categoria,
                description: data.descripcion,
                fileName: file.name,
            });

            reset();
        } catch (error) {
            console.error("Error al subir documento:", error);
        }
    };
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Documentación de prácticas</CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="upload" className="w-full">
                    <TabsList className="mb-4">
                        <TabsTrigger value="upload">Subir documento</TabsTrigger>
                        <TabsTrigger value="list">Ver documentos</TabsTrigger>
                    </TabsList>

                    {/* TAB DE SUBIR */}
                    <TabsContent value="upload">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="title" className="text-sm font-medium">
                                    Título del documento
                                </label>
                                <Input
                                    id="title"
                                    placeholder="Ej: Formato de postulación"
                                    {...register("titulo", { required: "El título es obligatorio" })}
                                />
                                {errors.titulo && (
                                    <p className="text-sm text-red-500">{errors.titulo.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="category" className="text-sm font-medium">
                                    Categoría
                                </label>
                                <select
                                    id="category"
                                    className="w-full border rounded-md p-2"
                                    {...register("categoria", { required: "Selecciona una categoría" })}
                                    defaultValue="Lineamientos generales"
                                >
                                    <option>Lineamientos generales</option>
                                    <option>Formatos de postulación</option>
                                    <option>Documentos ARL</option>
                                    <option>Otros</option>
                                </select>
                                {errors.categoria && (
                                    <p className="text-sm text-red-500">{errors.categoria.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="description" className="text-sm font-medium">
                                    Descripción
                                </label>
                                <Textarea
                                    id="description"
                                    placeholder="Ej: Documento necesario para la postulación"
                                    {...register("descripcion")}
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="file" className="text-sm font-medium">
                                    Archivo
                                </label>
                                <Input
                                    id="file"
                                    type="file"
                                    accept=".pdf,.doc,.docx,.png,.jpg"
                                    {...register("archivo", { required: "Debes seleccionar un archivo" })}
                                />
                                {errors.archivo && (
                                    <p className="text-sm text-red-500">{errors.archivo.message}</p>
                                )}
                            </div>
                            <Button type="submit" disabled={isSubmitting} className="bg-red-600 hover:bg-red-700">
                                {isSubmitting ? "Subiendo..." : "Subir documento"}
                            </Button>
                        </form>
                    </TabsContent>

                    {/* TAB DE LISTADO */}
                    <TabsContent value="list">
                        {documents.length === 0 ? (
                            <p className="text-gray-500">No hay documentos subidos.</p>
                        ) : (
                            <div className="space-y-2">
                                {documents.map((doc) => (
                                    <div
                                        key={doc.id}
                                        className="border rounded p-3 flex justify-between items-center"
                                    >
                                        <div>
                                            <h5 className="font-semibold">{doc.title}</h5>
                                            <p className="text-sm text-gray-600">
                                                {doc.category} • {doc.fileName}
                                            </p>
                                        </div>
                                        <Button
                                            variant="destructive"
                                            onClick={() => removeDocument(doc.id)}
                                        >
                                            Eliminar
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};
