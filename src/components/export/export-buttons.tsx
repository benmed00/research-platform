/**
 * @file export-buttons.tsx
 * @description src/components/export/export-buttons.tsx
 * @author github-actions[bot]
 * @created 2026-01-04
 * @updated 2026-01-04
 * @updates 1
 * @lines 84
 * @size 2.50 KB
 */
"use client";

import { Button } from "@/components/ui/button";
import { FileSpreadsheet, FileText, FileDown } from "lucide-react";
import { useState } from "react";
import { exportToExcel, exportToPDF, exportToCSV, downloadBlob, getExportFilename, ExportType } from "@/lib/export-utils";
import { useNotifications } from "@/components/notifications/notification-provider";

interface ExportButtonsProps {
  type: ExportType;
  filters?: Record<string, any>;
  entityId?: string;
  className?: string;
  showLabels?: boolean;
}

export function ExportButtons({
  type,
  filters,
  entityId,
  className = "",
  showLabels = true,
}: ExportButtonsProps) {
  const [exportingExcel, setExportingExcel] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);
  const [exportingCSV, setExportingCSV] = useState(false);
  const { success, error: notifyError } = useNotifications();

  const handleExportExcel = async () => {
    try {
      setExportingExcel(true);
      const blob = await exportToExcel(type, filters);
      const filename = getExportFilename(type, "xlsx");
      downloadBlob(blob, filename);
      success(`Export Excel réussi : ${filename}`);
    } catch (err: any) {
      console.error("Error exporting to Excel:", err);
      notifyError(err.message || "Erreur lors de l'export Excel");
    } finally {
      setExportingExcel(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      setExportingPDF(true);
      const blob = await exportToPDF(type, filters, entityId);
      const filename = getExportFilename(type, "pdf");
      downloadBlob(blob, filename);
      success(`Export PDF réussi : ${filename}`);
    } catch (err: any) {
      console.error("Error exporting to PDF:", err);
      notifyError(err.message || "Erreur lors de l'export PDF");
    } finally {
      setExportingPDF(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      setExportingCSV(true);
      const blob = await exportToCSV(type, filters);
      const filename = getExportFilename(type, "csv");
      downloadBlob(blob, filename);
      success(`Export CSV réussi : ${filename}`);
    } catch (err: any) {
      console.error("Error exporting to CSV:", err);
      notifyError(err.message || "Erreur lors de l'export CSV");
    } finally {
      setExportingCSV(false);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        variant="outline"
        size={showLabels ? "default" : "icon"}
        onClick={handleExportExcel}
        disabled={exportingExcel || exportingPDF || exportingCSV}
        title="Exporter en Excel"
      >
        <FileSpreadsheet className="w-4 h-4" />
        {showLabels && <span className="ml-2">Excel</span>}
      </Button>
      <Button
        variant="outline"
        size={showLabels ? "default" : "icon"}
        onClick={handleExportPDF}
        disabled={exportingExcel || exportingPDF || exportingCSV}
        title="Exporter en PDF"
      >
        <FileText className="w-4 h-4" />
        {showLabels && <span className="ml-2">PDF</span>}
      </Button>
      <Button
        variant="outline"
        size={showLabels ? "default" : "icon"}
        onClick={handleExportCSV}
        disabled={exportingExcel || exportingPDF || exportingCSV}
        title="Exporter en CSV"
      >
        <FileDown className="w-4 h-4" />
        {showLabels && <span className="ml-2">CSV</span>}
      </Button>
    </div>
  );
}

