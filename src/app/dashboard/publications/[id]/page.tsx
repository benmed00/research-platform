/**
 * @file page.tsx
 * @description src/app/dashboard/publications/[id]/page.tsx
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-01
 * @updates 2
 * @lines 207
 * @size 6.97 KB
 */
import { prisma } from "@/lib/prisma";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { EmptyState } from "@/components/ui/empty-state";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Edit, BookOpen, FileDown } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { notFound } from "next/navigation";

// Force dynamic rendering to avoid build-time database queries
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function PublicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const publication = await prisma.publication.findUnique({
    where: { id },
    include: {
      chapters: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!publication) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/publications">
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
              {publication.title}
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-400 mt-1.5">
              {publication.year} • {publication.type}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/publications/${publication.id}/edit`}>
            <Button>
              <Edit className="w-4 h-4 mr-2" />
              Modifier
            </Button>
          </Link>
          {publication.isPublished && (
            <Button variant="outline">
              <FileDown className="w-4 h-4 mr-2" />
              Exporter PDF
            </Button>
          )}
        </div>
      </div>

      {publication.coverImage && (
        <Card variant="elevated" className="p-6">
          <div className="relative w-full max-w-md h-96 mx-auto rounded-lg overflow-hidden border border-border shadow-sm">
            <Image
              src={publication.coverImage}
              alt={publication.title}
              fill
              className="object-cover"
            />
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card variant="elevated" className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Contenu
            </CardTitle>
          </CardHeader>
          <CardContent>
            {publication.content ? (
              <div
                className="prose max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: publication.content }}
              />
            ) : (
              <EmptyState
                icon={BookOpen}
                title="Aucun contenu disponible"
                description="Le contenu de cette publication n'a pas encore été ajouté."
              />
            )}
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Informations</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <Label>Année</Label>
                <p className="mt-1 text-sm text-foreground font-medium">
                  {publication.year}
                </p>
              </div>
              <div>
                <Label>Type</Label>
                <p className="mt-1 text-sm text-foreground font-medium">
                  {publication.type}
                </p>
              </div>
              <div>
                <Label>Statut</Label>
                <div className="mt-1">
                  <Badge
                    variant={publication.isPublished ? "success" : "warning"}
                    size="sm"
                  >
                    {publication.isPublished ? "Publié" : "En préparation"}
                  </Badge>
                </div>
              </div>
              {publication.publishedAt && (
                <div>
                  <Label>Date de publication</Label>
                  <p className="mt-1 text-sm text-foreground font-medium">
                    {formatDate(publication.publishedAt)}
                  </p>
                </div>
              )}
              <div>
                <Label>Créé le</Label>
                <p className="mt-1 text-sm text-foreground font-medium">
                  {formatDate(publication.createdAt)}
                </p>
              </div>
              <div>
                <Label>Modifié le</Label>
                <p className="mt-1 text-sm text-foreground font-medium">
                  {formatDate(publication.updatedAt)}
                </p>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      {publication.chapters.length > 0 && (
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Chapitres ({publication.chapters.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {publication.chapters.map((chapter) => (
                <div
                  key={chapter.id}
                  className="p-4 bg-muted/50 dark:bg-muted/30 rounded-lg border-l-4 border-primary hover:bg-muted transition-colors duration-150"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground">
                        Chapitre {chapter.order}: {chapter.title}
                      </p>
                      {chapter.content && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {chapter.content.substring(0, 150)}...
                        </p>
                      )}
                    </div>
                    <Link href={`/dashboard/publications/${publication.id}/chapters/${chapter.id}`}>
                      <Button variant="ghost" size="sm" className="ml-4 flex-shrink-0">
                        Voir
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


