import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

export interface Column<T extends object> {
  /** Propiedad del objeto que se mostrará */
  key: keyof T;
  /** Título visible en el encabezado */
  title: string;
  /** Render personalizado para celdas */
  render?: (value: T[keyof T], record: T, index: number) => React.ReactNode;
  /** Alineación de la celda */
  align?: "left" | "center" | "right";
  /** Clase opcional */
  className?: string;
  /**tipo de filtro */
  filterType?: "text" | "select";
  /** Opciones si es un select */
  filterOptions?: { label: string; value: string }[];
}

interface TableProps<T extends { id?: string | number }> {
  columns: Column<T>[];
  data: T[];
  total?: number;
  page?: number;
  pageSize?: number;
  className?: string;
  loading?: boolean;
  onChange?: (params: {
    filters: Record<string, string>;
    page: number;
    pageSize: number;
  }) => void;
}

export function Table<T extends { id?: string | number }>({
  columns,
  data,
  total = 0,
  page: initialPage = 1,
  pageSize = 10,
  className,
  loading = false,
  onChange,
}: TableProps<T>) {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [page, setPage] = useState(initialPage);

  /** Debounce para inputs de texto */
  useEffect(() => {
    const handler = setTimeout(() => {
      onChange?.({ filters, page, pageSize });
    }, 500); // 0.5s después de escribir

    return () => clearTimeout(handler);
  }, [filters, page]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1); // Reiniciar al cambiar filtros
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    onChange?.({ filters, page: newPage, pageSize });
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className={cn("overflow-x-auto rounded-md border", className)}>
      <table className="min-w-full text-sm text-left text-gray-700">
        <thead className="bg-gray-100 text-gray-800">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={cn(
                  "px-4 py-2 font-medium",
                  col.align === "center" && "text-center",
                  col.align === "right" && "text-right"
                )}
              >
                <div className="flex items-center gap-2">
                  <span>{col.title}</span>

                  {/* 🔹 Si la columna tiene filtro */}
                  {col.filterType === "text" && (
                    <Input
                      value={filters[col.key as string] || ""}
                      onChange={(e) =>
                        handleFilterChange(String(col.key), e.target.value)
                      }
                      placeholder=""
                      className="h-7 w-24 text-xs"
                    />
                  )}

                  {col.filterType === "select" && (
                    <Select
                      value={filters[col.key as string] || ""}
                      onValueChange={(v) =>
                        handleFilterChange(String(col.key), v)
                      }
                    >
                      <SelectTrigger className="h-7 w-28 text-xs">
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">Todos</SelectItem>
                        {col.filterOptions?.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        {loading && (
          <tbody>
            <tr>
              <td colSpan={columns.length}>
                <div className="flex justify-center items-center py-10">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
                </div>
              </td>
            </tr>
          </tbody>
        )}
        {!loading && (
          <tbody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr
                key={row.id ?? rowIndex}
                className="border-t hover:bg-gray-50 transition-colors"
              >
                {columns.map((col) => {
                  const rawValue = row[col.key];
                  const value =
                    typeof rawValue === "object" || typeof rawValue === "function"
                      ? String(rawValue)
                      : (rawValue as React.ReactNode);

                  return (
                    <td
                      key={String(col.key)}
                      className={cn(
                        "px-4 py-2",
                        col.align === "center" && "text-center",
                        col.align === "right" && "text-right",
                        col.className
                      )}
                    >
                      {col.render ? col.render(rawValue, row, rowIndex) : value}
                    </td>
                  );
                })}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-6 text-gray-500 italic"
              >
                No hay datos disponibles
              </td>
            </tr>
          )}
        </tbody>
        )}
      </table>

      {total > 0 && (
        <div className="flex justify-between items-center p-3 text-sm">
          <p>
            Página {page} de {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => handlePageChange(page - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => handlePageChange(page + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
