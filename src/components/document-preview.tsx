/**
 * @file document-preview.tsx
 * @description src/components/document-preview.tsx
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-01
 * @updates 1
 * @lines 114
 * @size 3.77 KB
 */
"use client";

import { useState } from "react";
import { File, Download, X, Eye, FileText, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface DocumentPreviewProps {
  document: {
    id: string;
    title: string;
    fileUrl: string;
    fileName: string;
    mimeType?: string | null;
    description?: string | null;
  };
  onClose?: () => void;
}

export function DocumentPreview({ document, onClose }: DocumentPreviewProps) {
  const [error, setError] = useState(false);

  const isImage = document.mimeType?.startsWith("image/");
  const isPdf = document.mimeType === "application/pdf" || document.fileName.endsWith(".pdf");

  const handleDownload = () => {
    const link = window.document.createElement("a");
    link.href = document.fileUrl;
    link.download = document.fileName;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isImage ? (
            <ImageIcon className="w-6 h-6 text-blue-600" />
          ) : (
            <FileText className="w-6 h-6 text-blue-600" />
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {document.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{document.fileName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Télécharger
          </Button>
          {onClose && (
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {document.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400">{document.description}</p>
      )}

      <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900">
        {isImage ? (
          <div className="relative w-full h-96 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            {!error ? (
              <Image
                src={document.fileUrl}
                alt={document.title}
                fill
                className="object-contain"
                onError={() => setError(true)}
              />
            ) : (
              <div className="text-center p-8">
                <ImageIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  Impossible de charger l&apos;image
                </p>
              </div>
            )}
          </div>
        ) : isPdf ? (
          <div className="w-full h-[600px]">
            <iframe
              src={document.fileUrl}
              className="w-full h-full border-0"
              title={document.title}
            />
          </div>
        ) : (
          <div className="p-12 text-center">
            <File className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Aperçu non disponible pour ce type de fichier
            </p>
            <Button onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Télécharger pour voir le contenu
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

