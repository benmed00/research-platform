/**
 * @file page.tsx
 * @description src/app/dashboard/publications/[id]/chapters/[chapterId]/page.tsx
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-01
 * @updates 1
 * @lines 145
 * @size 4.5 KB
 */
import { prisma } from "@/lib/prisma";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { EmptyState } from "@/components/ui/empty-state";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { notFound } from "next/navigation";

// Force dynamic rendering to avoid build-time database queries
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ChapterDetailPage({
  params,
}: {
  params: Promise<{ id: string; chapterId: string }>;
}) {
  const { id, chapterId } = await params;
  
  const chapter = await prisma.publicationChapter.findUnique({
    where: { id: chapterId },
    include: {
      publication: {
        select: {
          id: true,
          title: true,
          year: true,
          type: true,
        },
      },
    },
  });

  if (!chapter || chapter.publicationId !== id) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/publications/${id}`}>
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
              Chapitre {chapter.order}: {chapter.title}
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-400 mt-1.5">
              {chapter.publication.title} • {chapter.publication.year} • {chapter.publication.type}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card variant="elevated" className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Contenu du chapitre
            </CardTitle>
          </CardHeader>
          <CardContent>
            {chapter.content ? (
              <div
                className="prose max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: chapter.content }}
              />
            ) : (
              <EmptyState
                icon={BookOpen}
                title="Aucun contenu disponible"
                description="Le contenu de ce chapitre n'a pas encore été ajouté."
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
                <Label>Publication</Label>
                <p className="mt-1 text-sm text-foreground font-medium">
                  {chapter.publication.title}
                </p>
              </div>
              <div>
                <Label>Numéro de chapitre</Label>
                <p className="mt-1 text-sm text-foreground font-medium">
                  {chapter.order}
                </p>
              </div>
              <div>
                <Label>Titre</Label>
                <p className="mt-1 text-sm text-foreground font-medium">
                  {chapter.title}
                </p>
              </div>
              <div>
                <Label>Créé le</Label>
                <p className="mt-1 text-sm text-foreground font-medium">
                  {formatDate(chapter.createdAt)}
                </p>
              </div>
              <div>
                <Label>Modifié le</Label>
                <p className="mt-1 text-sm text-foreground font-medium">
                  {formatDate(chapter.updatedAt)}
                </p>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

