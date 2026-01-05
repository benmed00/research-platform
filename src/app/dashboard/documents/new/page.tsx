/**
 * @file page.tsx
 * @description src/app/dashboard/documents/new/page.tsx
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-04
 * @updates 3
 * @lines 223
 * @size 6.87 KB
 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FileUpload } from "@/components/ui/file-upload";
import { useToast } from "@/components/ui/toast";
import { z } from "zod";

const documentSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  type: z.enum([
    "RAPPORT_SCIENTIFIQUE",
    "RAPPORT_ADMINISTRATIF",
    "DONNEE_BRUTE",
    "PUBLICATION",
    "AUTRE",
  ]),
  description: z.string().optional(),
  missionId: z.string().optional(),
  isPublic: z.boolean().default(false),
});

type DocumentFormData = z.infer<typeof documentSchema>;

const documentTypes = [
  "RAPPORT_SCIENTIFIQUE",
  "RAPPORT_ADMINISTRATIF",
  "DONNEE_BRUTE",
  "PUBLICATION",
  "AUTRE",
];

const typeLabels: Record<string, string> = {
  RAPPORT_SCIENTIFIQUE: "Rapport Scientifique",
  RAPPORT_ADMINISTRATIF: "Rapport Administratif",
  DONNEE_BRUTE: "Donnée Brute",
  PUBLICATION: "Publication",
  AUTRE: "Autre",
};

export default function NewDocumentPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DocumentFormData>({
    resolver: zodResolver(documentSchema),
  });

  const onSubmit = async (data: DocumentFormData) => {
    if (!file) {
      showToast("Veuillez sélectionner un fichier", "warning");
      return;
    }

    setUploading(true);
    try {
      const formDataObj = new FormData();
      formDataObj.append("file", file);
      formDataObj.append("title", data.title);
      formDataObj.append("type", data.type);
      if (data.description) formDataObj.append("description", data.description);
      if (data.missionId) formDataObj.append("missionId", data.missionId);
      formDataObj.append("isPublic", data.isPublic.toString());

      const response = await fetch("/api/documents", {
        method: "POST",
        body: formDataObj,
      });

      if (response.ok) {
        showToast("Document créé avec succès!", "success");
        router.push("/dashboard/documents");
      } else {
        const error = await response.json();
        showToast(error.error || "Erreur lors de la création", "error");
      }
    } catch (error) {
      showToast("Erreur lors de la création", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/documents">
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            Nouveau document
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400 mt-1.5">
            Ajouter un nouveau document
          </p>
        </div>
      </div>

      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Détails du document</CardTitle>
          <CardDescription>
            Remplissez les informations et téléversez le fichier pour ajouter un nouveau document.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="title" required>
                Titre
              </Label>
              <Input
                id="title"
                {...register("title")}
                className={errors.title ? "border-destructive" : ""}
                placeholder="Ex: Rapport annuel 2024"
              />
              {errors.title && (
                <p className="text-destructive text-sm mt-1.5">{errors.title.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="type" required>
                Type
              </Label>
              <Select
                id="type"
                {...register("type")}
                className={errors.type ? "border-destructive" : ""}
              >
                <option value="">Sélectionner un type</option>
                {documentTypes.map((type) => (
                  <option key={type} value={type}>
                    {typeLabels[type]}
                  </option>
                ))}
              </Select>
              {errors.type && (
                <p className="text-destructive text-sm mt-1.5">{errors.type.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                rows={4}
                placeholder="Description du document..."
              />
            </div>

            <div>
              <Label htmlFor="file" required>
                Fichier
              </Label>
              <FileUpload
                file={file}
                onFileChange={setFile}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.jpg,.jpeg,.png"
                maxSize={50}
                disabled={uploading || isSubmitting}
                showPreview={true}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPublic"
                {...register("isPublic")}
                className="rounded border-input"
              />
              <Label htmlFor="isPublic" className="font-normal cursor-pointer">
                Document public (accessible sans authentification)
              </Label>
            </div>

            <div className="flex items-center gap-4 border-t border-border pt-6 mt-6">
              <Button type="submit" disabled={isSubmitting || uploading}>
                {uploading ? "Upload en cours..." : isSubmitting ? "Création..." : "Créer"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Annuler
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

