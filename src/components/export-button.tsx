/**
 * @file export-button.tsx
 * @description src/components/export-button.tsx
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-04
 * @updates 3
 * @lines 98
 * @size 2.75 KB
 */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileDown, FileSpreadsheet, FileText } from "lucide-react";

interface ExportButtonProps {
  type: "missions" | "species" | "expenses" | "employees" | "equipment" | "documents" | "publications";
  filters?: Record<string, any>;
  variant?: "default" | "outline" | "ghost";
}

export function ExportButton({ type, filters, variant = "outline" }: ExportButtonProps) {
  const [exporting, setExporting] = useState<"excel" | "pdf" | null>(null);

  const handleExport = async (format: "excel" | "pdf") => {
    setExporting(format);
    try {
      const response = await fetch("/api/export/" + format, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, filters }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = response.headers.get("Content-Disposition")?.split("filename=")[1]?.replace(/"/g, "") || `${type}.${format === "excel" ? "xlsx" : "pdf"}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const error = await response.json();
        alert(error.error || "Erreur lors de l'export");
      }
    } catch (error) {
      alert("Erreur lors de l'export");
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={variant}
        size="sm"
        onClick={() => handleExport("excel")}
        disabled={exporting !== null}
      >
        {exporting === "excel" ? (
          <>
            <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            Export...
          </>
        ) : (
          <>
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Excel
          </>
        )}
      </Button>
      <Button
        variant={variant}
        size="sm"
        onClick={() => handleExport("pdf")}
        disabled={exporting !== null}
      >
        {exporting === "pdf" ? (
          <>
            <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            Export...
          </>
        ) : (
          <>
            <FileText className="w-4 h-4 mr-2" />
            PDF
          </>
        )}
      </Button>
    </div>
  );
}

