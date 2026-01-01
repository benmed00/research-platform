/**
 * @file page.tsx
 * @description src/app/dashboard/publications/[id]/edit/page.tsx
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-01
 * @updates 2
 * @lines 260
 * @size 8.54 KB
 */
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useApi } from "@/hooks/use-api";
import { publicationSchema } from "@/lib/validations";
import { z } from "zod";

type PublicationFormData = z.infer<typeof publicationSchema> & {
  content?: string;
  coverImage?: string;
};

const publicationTypes = ["LIVRE_ANNUEL", "ARTICLE", "RAPPORT", "AUTRE"];

const typeLabels: Record<string, string> = {
  LIVRE_ANNUEL: "Livre Annuel",
  ARTICLE: "Article",
  RAPPORT: "Rapport",
  AUTRE: "Autre",
};

const statusLabels: Record<string, string> = {
  DRAFT: "Brouillon",
  IN_REVIEW: "En révision",
  PUBLISHED: "Publié",
};

export default function EditPublicationPage() {
  const router = useRouter();
  const params = useParams();
  const { handleApiCall, showToast } = useApi();
  const [loading, setLoading] = useState(true);
  const [publicationData, setPublicationData] = useState<any>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<PublicationFormData>({
    resolver: zodResolver(publicationSchema),
  });

  useEffect(() => {
    fetch(`/api/publications/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          showToast(data.error, "error");
          router.back();
          return;
        }
        setPublicationData(data);
        setValue("title", data.title);
        setValue("year", data.year.toString());
        setValue("type", data.type);
        setValue("description", data.content || "");
        // Map isPublished to status
        const status = data.isPublished ? "PUBLISHED" : "DRAFT";
        setValue("status", status as any);
        setLoading(false);
      })
      .catch(() => {
        showToast("Erreur lors du chargement", "error");
        router.back();
      });
  }, [params.id, router, setValue, showToast]);

  const onSubmit = async (data: PublicationFormData) => {
    // Map status back to isPublished
    const updateData = {
      ...data,
      isPublished: data.status === "PUBLISHED",
      publishedAt: data.status === "PUBLISHED" ? new Date().toISOString() : undefined,
      content: data.description || publicationData?.content,
      coverImage: publicationData?.coverImage,
    };

    await handleApiCall(
      () =>
        fetch(`/api/publications/${params.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        }),
      {
        successMessage: "Publication mise à jour avec succès!",
        redirect: `/dashboard/publications/${params.id}`,
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
        <h1 className="text-3xl font-bold text-gray-900">Modifier la publication</h1>
        <p className="text-gray-600 mt-2">Modifier les informations de la publication</p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
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

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Année *
              </label>
              <Input
                type="number"
                {...register("year")}
                className={errors.year ? "border-red-500" : ""}
              />
              {errors.year && (
                <p className="text-red-500 text-sm mt-1">{errors.year.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type *
              </label>
              <Select
                {...register("type")}
                className={errors.type ? "border-red-500" : ""}
              >
                <option value="">Sélectionner un type</option>
                {publicationTypes.map((type) => (
                  <option key={type} value={type}>
                    {typeLabels[type]}
                  </option>
                ))}
              </Select>
              {errors.type && (
                <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statut *
            </label>
            <Select
              {...register("status")}
              className={errors.status ? "border-red-500" : ""}
            >
              <option value="DRAFT">Brouillon</option>
              <option value="IN_REVIEW">En révision</option>
              <option value="PUBLISHED">Publié</option>
            </Select>
            {errors.status && (
              <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description / Contenu
            </label>
            <Textarea {...register("description")} rows={10} />
          </div>

          {publicationData?.coverImage && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Image de couverture
              </label>
              <div className="relative w-full max-w-md h-64 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <Image
                  src={publicationData.coverImage}
                  alt={publicationData.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {publicationData?.chapters && publicationData.chapters.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chapitres ({publicationData.chapters.length})
              </label>
              <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                {publicationData.chapters.map((chapter: any, index: number) => (
                  <div key={chapter.id} className="text-sm">
                    <span className="font-medium">
                      Chapitre {chapter.order}: {chapter.title}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Note: La gestion des chapitres sera disponible dans une version future
              </p>
            </div>
          )}

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

