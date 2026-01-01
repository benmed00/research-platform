/**
 * @file page.tsx
 * @description src/app/dashboard/publications/new/page.tsx
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-01
 * @updates 2
 * @lines 197
 * @size 6.27 KB
 */
"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useApi } from "@/hooks/use-api";
import { z } from "zod";

const publicationSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  year: z.string().refine(
    (val) => {
      const year = parseInt(val);
      return !isNaN(year) && year >= 2020 && year <= 2100;
    },
    { message: "L'année doit être entre 2020 et 2100" }
  ),
  type: z.string().min(1, "Le type est requis"),
  content: z.string().optional(),
  coverImage: z.string().optional(),
  isPublished: z.boolean().default(false),
});

type PublicationFormData = z.infer<typeof publicationSchema>;

export default function NewPublicationPage() {
  const router = useRouter();
  const { handleApiCall } = useApi();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PublicationFormData>({
    resolver: zodResolver(publicationSchema),
    defaultValues: {
      isPublished: false,
    },
  });

  const onSubmit = async (data: PublicationFormData) => {
    await handleApiCall(
      () =>
        fetch("/api/publications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }),
      {
        successMessage: "Publication créée avec succès!",
        onSuccess: (publication) => {
          router.push(`/dashboard/publications/${publication.id}`);
        },
      }
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/publications">
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            Nouvelle publication
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400 mt-1.5">
            Créer une nouvelle publication
          </p>
        </div>
      </div>

      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Détails de la publication</CardTitle>
          <CardDescription>
            Remplissez les informations pour créer une nouvelle publication.
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
                placeholder="Ex: Livre Annuel 2024"
              />
              {errors.title && (
                <p className="text-destructive text-sm mt-1.5">{errors.title.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="year" required>
                  Année
                </Label>
                <Input
                  id="year"
                  type="number"
                  {...register("year")}
                  className={errors.year ? "border-destructive" : ""}
                  placeholder="2024"
                />
                {errors.year && (
                  <p className="text-destructive text-sm mt-1.5">{errors.year.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="type" required>
                  Type
                </Label>
                <Input
                  id="type"
                  {...register("type")}
                  placeholder="livre_annuel, article, rapport"
                  className={errors.type ? "border-destructive" : ""}
                />
                {errors.type && (
                  <p className="text-destructive text-sm mt-1.5">{errors.type.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="coverImage">Image de couverture (URL)</Label>
              <Input
                id="coverImage"
                {...register("coverImage")}
                type="url"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <Label htmlFor="content">Contenu (Markdown)</Label>
              <Textarea
                id="content"
                {...register("content")}
                rows={10}
                placeholder="Contenu de la publication en Markdown..."
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPublished"
                {...register("isPublished")}
                className="rounded border-input"
              />
              <Label htmlFor="isPublished" className="font-normal cursor-pointer">
                Publier immédiatement
              </Label>
            </div>

            <div className="flex items-center gap-4 border-t border-border pt-6 mt-6">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Création..." : "Créer"}
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


