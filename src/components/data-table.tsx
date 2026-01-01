/**
 * @file data-table.tsx
 * @description src/components/data-table.tsx
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-01
 * @updates 1
 * @lines 97
 * @size 2.97 KB
 */
"use client";

import { ReactNode, memo, useCallback } from "react";
import { Card } from "@/components/ui/card";

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
}

function DataTableComponent<T extends { id: string }>({
  data,
  columns,
  onRowClick,
  emptyMessage = "Aucune donnée disponible",
}: DataTableProps<T>) {
  const getCellValue = useCallback((row: T, column: Column<T>) => {
    if (typeof column.accessor === "function") {
      return column.accessor(row);
    }
    return row[column.accessor] as ReactNode;
  }, []);

  const handleRowClick = useCallback((row: T) => {
    onRowClick?.(row);
  }, [onRowClick]);

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle sm:px-0">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${
                    column.className || ""
                  }`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={row.id}
                  className={`hover:bg-gray-50 ${
                    onRowClick ? "cursor-pointer" : ""
                  }`}
                  onClick={() => handleRowClick(row)}
                >
                  {columns.map((column, index) => (
                    <td
                      key={index}
                  className={`px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 ${
                    column.className || ""
                  }`}
                    >
                      {getCellValue(row, column)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>
    </Card>
  );
}

export const DataTable = memo(DataTableComponent) as typeof DataTableComponent;

