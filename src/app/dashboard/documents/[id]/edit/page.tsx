/**
 * @file page.tsx
 * @description src/app/dashboard/documents/[id]/edit/page.tsx
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-04
 * @updates 3
 * @lines 196
 * @size 5.82 KB
 */
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useApi } from "@/hooks/use-api";
import { documentSchema } from "@/lib/validations";
import { z } from "zod";

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

export default function EditDocumentPage() {
  const router = useRouter();
  const params = useParams();
  const { handleApiCall, showToast } = useApi();
  const [loading, setLoading] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<DocumentFormData>({
    resolver: zodResolver(documentSchema),
  });

  useEffect(() => {
    fetch(`/api/documents/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          showToast(data.error, "error");
          router.back();
          return;
        }
        setValue("title", data.title);
        setValue("type", data.type);
        setValue("description", data.description || "");
        setValue("missionId", data.missionId || "");
        setValue("isPublic", data.isPublic || false);
        setLoading(false);
      })
      .catch(() => {
        showToast("Erreur lors du chargement", "error");
        router.back();
      });
  }, [params.id, router, setValue, showToast]);

  const onSubmit = async (data: DocumentFormData) => {
    await handleApiCall(
      () =>
        fetch(`/api/documents/${params.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }),
      {
        successMessage: "Document mis à jour avec succès!",
        redirect: `/dashboard/documents/${params.id}`,
      }
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Modifier le document</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Modifier les métadonnées du document</p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Titre *
            </label>
            <Input
              {...register("title")}
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Type *
            </label>
            <Select
              {...register("type")}
              className={errors.type ? "border-red-500" : ""}
            >
              <option value="">Sélectionner un type</option>
              {documentTypes.map((type) => (
                <option key={type} value={type}>
                  {typeLabels[type]}
                </option>
              ))}
            </Select>
            {errors.type && (
              <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <Textarea {...register("description")} rows={4} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ID Mission (optionnel)
            </label>
            <Input
              {...register("missionId")}
              placeholder="ID de la mission associée"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register("isPublic")}
              className="rounded border-gray-300"
            />
            <label className="text-sm text-gray-700 dark:text-gray-300">
              Document public (accessible sans authentification)
            </label>
          </div>

          <div className="flex items-center gap-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Annuler
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

