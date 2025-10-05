import React from "react";
import { cn } from "@/lib/utils";

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
}

interface TableProps<T extends { id?: string | number }> {
  columns: Column<T>[];
  data: T[];
  className?: string;
}

/**
 * Componente de tabla genérico similar al Table de Ant Design.
 * Totalmente tipado y sin usar `any`.
 */
export function Table<T extends { id?: string | number }>({
  columns,
  data,
  className,
}: TableProps<T>) {
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
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
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
      </table>
    </div>
  );
}
