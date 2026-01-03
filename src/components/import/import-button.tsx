"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, FileText, X, AlertCircle, CheckCircle } from "lucide-react";
import { useNotifications } from "@/components/notifications/notification-provider";

interface ImportButtonProps {
  type: "species" | "missions" | "equipment" | "locations";
  onImportSuccess?: () => void;
  className?: string;
}

export function ImportButton({ type, onImportSuccess, className }: ImportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{
    success: boolean;
    message: string;
    details?: any;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { success, error: notifyError } = useNotifications();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validExtensions = [".csv", ".xlsx", ".xls", ".json", ".geojson"];
      const fileExtension = selectedFile.name.toLowerCase().slice(selectedFile.name.lastIndexOf("."));
      
      if (!validExtensions.includes(fileExtension)) {
        notifyError(`Format de fichier non supporté. Formats acceptés : ${validExtensions.join(", ")}`);
        return;
      }

      setFile(selectedFile);
      setImportResult(null);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    setImportResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      const response = await fetch("/api/import", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erreur lors de l'import");
      }

      setImportResult({
        success: true,
        message: result.message || "Import réussi",
        details: result.details,
      });

      success(
        `Import réussi : ${result.details?.imported || 0} élément(s) importé(s), ${result.details?.skipped || 0} ignoré(s)`
      );

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setFile(null);

      // Call success callback
      if (onImportSuccess) {
        setTimeout(() => {
          onImportSuccess();
          setIsOpen(false);
        }, 1500);
      }
    } catch (err: any) {
      const errorMessage = err.message || "Erreur lors de l'import";
      setImportResult({
        success: false,
        message: errorMessage,
      });
      notifyError(errorMessage);
    } finally {
      setImporting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setFile(null);
    setImportResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case "species":
        return "Espèces";
      case "missions":
        return "Missions";
      case "equipment":
        return "Équipements";
      case "locations":
        return "Localisations";
      default:
        return "Données";
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className={className}
      >
        <Upload className="w-4 h-4 mr-2" />
        Importer {getTypeLabel()}
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Importer {getTypeLabel()}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fichier à importer
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.xlsx,.xls,.json,.geojson"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="import-file-input"
                  />
                  <label
                    htmlFor="import-file-input"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <FileText className="w-12 h-12 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Cliquez pour sélectionner un fichier
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      CSV, Excel ou GeoJSON
                    </span>
                  </label>
                </div>

                {file && (
                  <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-900 dark:text-gray-100 truncate">
                        {file.name}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {(file.size / 1024).toFixed(2)} KB
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {importResult && (
                <div
                  className={`p-4 rounded-lg flex items-start gap-3 ${
                    importResult.success
                      ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                      : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                  }`}
                >
                  {importResult.success ? (
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p
                      className={`text-sm font-medium ${
                        importResult.success
                          ? "text-green-900 dark:text-green-100"
                          : "text-red-900 dark:text-red-100"
                      }`}
                    >
                      {importResult.message}
                    </p>
                    {importResult.details && (
                      <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                        <p>Importés : {importResult.details.imported || 0}</p>
                        {importResult.details.skipped > 0 && (
                          <p>Ignorés : {importResult.details.skipped}</p>
                        )}
                        {importResult.details.errors && importResult.details.errors.length > 0 && (
                          <div className="mt-2">
                            <p className="font-medium">Erreurs :</p>
                            <ul className="list-disc list-inside">
                              {importResult.details.errors.slice(0, 5).map((err: string, idx: number) => (
                                <li key={idx}>{err}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={handleClose} disabled={importing}>
                  Annuler
                </Button>
                <Button
                  onClick={handleImport}
                  disabled={!file || importing}
                >
                  {importing ? "Import en cours..." : "Importer"}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}

