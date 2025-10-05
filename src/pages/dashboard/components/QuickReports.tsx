import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useReports } from "@/hooks/useReports";

export const QuickReports = () => {
    const { reports, loading, error } = useReports();

    if (loading) return <p className="text-gray-500">Cargando reportes...</p>;
    if (error) return <p className="text-red-600">{error}</p>;

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Reportes rápidos</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {reports.map((report, index) => (
                    <Card
                        key={index}
                        className="bg-gray-50 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <CardContent className="text-center py-6">
                            <p className="text-2xl font-bold text-red-700">{report.value}</p>
                            <p className="text-sm text-gray-700 mt-1">{report.label}</p>
                        </CardContent>
                    </Card>
                ))}
            </CardContent>
        </Card>
    );
};
