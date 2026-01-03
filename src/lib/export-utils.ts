/**
 * Utility functions for exporting data to Excel and PDF
 */

export type ExportType = 
  | "missions" 
  | "species" 
  | "equipment" 
  | "expenses" 
  | "employees" 
  | "budgets"
  | "publications"
  | "documents"
  | "leaves"
  | "salaries";

export interface ExportFilters {
  [key: string]: any;
}

/**
 * Export data to Excel
 */
export async function exportToExcel(
  type: ExportType,
  filters?: ExportFilters
): Promise<Blob> {
  const response = await fetch("/api/export/excel", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type,
      filters,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || "Erreur lors de l'export Excel");
  }

  return response.blob();
}

/**
 * Export data to PDF
 */
export async function exportToPDF(
  type: ExportType,
  filters?: ExportFilters,
  entityId?: string
): Promise<Blob> {
  const response = await fetch("/api/export/pdf", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type,
      filters,
      entityId,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || "Erreur lors de l'export PDF");
  }

  return response.blob();
}

/**
 * Download a blob as a file
 */
export function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

/**
 * Get filename for export
 */
export function getExportFilename(type: ExportType, format: "xlsx" | "pdf"): string {
  const date = new Date().toISOString().split("T")[0];
  const typeNames: Record<ExportType, string> = {
    missions: "missions",
    species: "especes",
    equipment: "equipements",
    expenses: "depenses",
    employees: "employes",
    budgets: "budgets",
    publications: "publications",
    documents: "documents",
    leaves: "conges",
    salaries: "salaires",
  };
  return `${typeNames[type]}-${date}.${format}`;
}

