/**
 * @file file-upload.tsx
 * @description src/components/ui/file-upload.tsx
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-01
 * @updates 2
 * @lines 209
 * @size 6.25 KB
 */
"use client";

import { useState, useRef, DragEvent } from "react";
import { Upload, X, File, Eye } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  accept?: string;
  maxSize?: number; // in MB
  disabled?: boolean;
  showPreview?: boolean;
}

export function FileUpload({
  file,
  onFileChange,
  accept = ".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.jpg,.jpeg,.png",
  maxSize = 50,
  disabled = false,
  showPreview = true,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    // Check file size
    const fileSizeMB = selectedFile.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      alert(`Le fichier est trop volumineux. Taille maximale: ${maxSize}MB`);
      return;
    }

    // Check file type
    const fileExtension = selectedFile.name.split(".").pop()?.toLowerCase();
    const acceptedExtensions = accept
      .split(",")
      .map((ext) => ext.trim().replace(".", "").toLowerCase());

    if (fileExtension && !acceptedExtensions.includes(fileExtension)) {
      alert(`Type de fichier non accepté. Types acceptés: ${accept}`);
      return;
    }

    onFileChange(selectedFile);

    // Create preview URL for images
    if (showPreview && selectedFile.type.startsWith("image/")) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleRemove = () => {
    onFileChange(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  return (
    <div className="space-y-4">
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
          isDragging
            ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
            : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleFileSelect}
          disabled={disabled}
        />

        {!file ? (
          <div className="space-y-4">
            <Upload className="w-12 h-12 mx-auto text-gray-400" />
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Glissez-déposez un fichier ici, ou
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
              >
                <Upload className="w-4 h-4 mr-2" />
                Sélectionner un fichier
              </Button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Taille maximale: {maxSize}MB • Types acceptés: {accept}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-4">
              <File className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatFileSize(file.size)}
                </p>
              </div>
              <button
                type="button"
                onClick={handleRemove}
                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                disabled={disabled}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {showPreview && previewUrl && (
              <div className="mt-4 relative w-full h-64 mx-auto rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className="object-contain"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

