/**
 * @file page.tsx
 * @description src/app/dashboard/documents/[id]/page.tsx
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-01
 * @updates 1
 * @lines 208
 * @size 6.86 KB
 */
import { prisma } from "@/lib/prisma";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { EmptyState } from "@/components/ui/empty-state";
import Link from "next/link";
import { ArrowLeft, Download, Edit, FileText } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { notFound } from "next/navigation";

const typeLabels: Record<string, string> = {
  RAPPORT_SCIENTIFIQUE: "Rapport Scientifique",
  RAPPORT_ADMINISTRATIF: "Rapport Administratif",
  DONNEE_BRUTE: "Donnée Brute",
  PUBLICATION: "Publication",
  AUTRE: "Autre",
};

export default async function DocumentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const document = await prisma.document.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      mission: {
        select: {
          id: true,
          title: true,
        },
      },
      versions: {
        orderBy: { version: "desc" },
      },
    },
  });

  if (!document) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/documents">
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
              {document.title}
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-400 mt-1.5">
              {typeLabels[document.type] || document.type}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={document.fileUrl} target="_blank">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Télécharger
            </Button>
          </Link>
          <Link href={`/dashboard/documents/${document.id}/edit`}>
            <Button>
              <Edit className="w-4 h-4 mr-2" />
              Modifier
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card variant="elevated" className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Informations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Description</Label>
              <p className="mt-1 text-sm text-foreground">
                {document.description || "Aucune description"}
              </p>
            </div>
            <div>
              <Label>Fichier</Label>
              <p className="mt-1 text-sm text-foreground font-medium">
                {document.fileName}
              </p>
              {document.fileSize && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {(document.fileSize / 1024).toFixed(2)} KB
                </p>
              )}
            </div>
            {document.mission && (
              <div>
                <Label>Mission associée</Label>
                <Link
                  href={`/dashboard/missions/${document.mission.id}`}
                  className="mt-1 text-sm text-primary hover:underline inline-block"
                >
                  {document.mission.title}
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Métadonnées</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <Label>Auteur</Label>
                <p className="mt-1 text-sm text-foreground font-medium">
                  {document.author.firstName} {document.author.lastName}
                </p>
              </div>
              <div>
                <Label>Version</Label>
                <p className="mt-1 text-sm text-foreground font-medium">
                  v{document.version}
                </p>
              </div>
              <div>
                <Label>Créé le</Label>
                <p className="mt-1 text-sm text-foreground font-medium">
                  {formatDate(document.createdAt)}
                </p>
              </div>
              <div>
                <Label>Modifié le</Label>
                <p className="mt-1 text-sm text-foreground font-medium">
                  {formatDate(document.updatedAt)}
                </p>
              </div>
              <div>
                <Label>Statut</Label>
                <div className="mt-1">
                  <Badge
                    variant={document.isPublic ? "success" : "secondary"}
                    size="sm"
                  >
                    {document.isPublic ? "Public" : "Privé"}
                  </Badge>
                </div>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      {document.versions.length > 0 && (
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Versions précédentes ({document.versions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {document.versions.map((version) => (
                <div
                  key={version.id}
                  className="flex items-center justify-between p-3 bg-muted/50 dark:bg-muted/30 rounded-lg border border-border hover:bg-muted transition-colors duration-150"
                >
                  <div>
                    <p className="font-semibold text-sm text-foreground">
                      Version {version.version}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDate(version.createdAt)}
                    </p>
                  </div>
                  <Link href={version.fileUrl} target="_blank">
                    <Button variant="ghost" size="sm" title="Télécharger">
                      <Download className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


