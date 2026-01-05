/**
 * @file page.tsx
 * @description src/app/dashboard/missions/[id]/page.tsx
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-04
 * @updates 3
 * @lines 336
 * @size 11.75 KB
 */
import { prisma } from "@/lib/prisma";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { EmptyState } from "@/components/ui/empty-state";
import Link from "next/link";
import { ArrowLeft, Edit, Users, Package, MapPin, Calendar, FileText } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { notFound } from "next/navigation";

const statusLabels: Record<string, string> = {
  planned: "Planifiée",
  in_progress: "En cours",
  completed: "Terminée",
  cancelled: "Annulée",
};

// Force dynamic rendering to avoid build-time database queries
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function MissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const mission = await prisma.mission.findUnique({
    where: { id },
    include: {
      creator: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      teams: {
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
              role: true,
            },
          },
          employee: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      },
      equipment: {
        include: {
          equipment: true,
        },
      },
      report: true,
      documents: {
        take: 10,
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!mission) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/missions">
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
              {mission.title}
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-400 mt-1.5">
              Créée par {mission.creator.firstName} {mission.creator.lastName}
            </p>
          </div>
        </div>
        <Link href={`/dashboard/missions/${mission.id}/edit`}>
          <Button>
            <Edit className="w-4 h-4 mr-2" />
            Modifier
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                <div>
                  <Label>Statut</Label>
                  <div className="mt-1">
                    <Badge
                      variant={
                        mission.status === "completed"
                          ? "success"
                          : mission.status === "in_progress"
                          ? "info"
                          : mission.status === "cancelled"
                          ? "error"
                          : "warning"
                      }
                      size="sm"
                    >
                      {statusLabels[mission.status] || mission.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label>Localisation</Label>
                  <p className="mt-1 text-sm text-foreground flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    {mission.location}
                  </p>
                </div>
                <div>
                  <Label>Date de début</Label>
                  <p className="mt-1 text-sm text-foreground flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    {formatDate(mission.startDate)}
                  </p>
                </div>
                <div>
                  <Label>Date de fin</Label>
                  <p className="mt-1 text-sm text-foreground flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    {formatDate(mission.endDate)}
                  </p>
                </div>
                {mission.latitude && mission.longitude && (
                  <div className="col-span-full">
                    <Label>Coordonnées GPS</Label>
                    <p className="mt-1 text-sm text-foreground">
                      {mission.latitude}, {mission.longitude}
                    </p>
                  </div>
                )}
                {mission.description && (
                  <div className="col-span-full">
                    <Label>Description</Label>
                    <p className="mt-1 text-sm text-foreground whitespace-pre-wrap">
                      {mission.description}
                    </p>
                  </div>
                )}
                {mission.objectives && (
                  <div className="col-span-full">
                    <Label>Objectifs</Label>
                    <p className="mt-1 text-sm text-foreground whitespace-pre-wrap">
                      {mission.objectives}
                    </p>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>

          {mission.report && (
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Rapport de mission
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mission.report.summary && (
                  <div>
                    <h3 className="font-semibold mb-2 text-foreground">Résumé</h3>
                    <p className="text-sm text-foreground whitespace-pre-wrap">
                      {mission.report.summary}
                    </p>
                  </div>
                )}
                {mission.report.findings && (
                  <div>
                    <h3 className="font-semibold mb-2 text-foreground">Résultats</h3>
                    <p className="text-sm text-foreground whitespace-pre-wrap">
                      {mission.report.findings}
                    </p>
                  </div>
                )}
                {mission.report.recommendations && (
                  <div>
                    <h3 className="font-semibold mb-2 text-foreground">Recommandations</h3>
                    <p className="text-sm text-foreground whitespace-pre-wrap">
                      {mission.report.recommendations}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {mission.documents.length > 0 && (
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Documents associés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mission.documents.map((doc) => (
                    <Link
                      key={doc.id}
                      href={`/dashboard/documents/${doc.id}`}
                      className="flex items-center gap-2 p-3 bg-muted/50 dark:bg-muted/30 rounded-lg border border-border hover:bg-muted transition-colors duration-150"
                    >
                      <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm font-semibold text-foreground flex-1">
                        {doc.title}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        v{doc.version}
                      </span>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Équipe ({mission.teams.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mission.teams.length > 0 ? (
                <div className="space-y-2">
                  {mission.teams.map((team) => (
                    <div
                      key={team.id}
                      className="p-3 bg-muted/50 dark:bg-muted/30 rounded-lg border border-border hover:bg-muted transition-colors duration-150"
                    >
                      <p className="text-sm font-semibold text-foreground">
                        {team.user
                          ? `${team.user.firstName} ${team.user.lastName}`
                          : team.employee?.user
                          ? `${team.employee.user.firstName} ${team.employee.user.lastName}`
                          : "Membre"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {team.role} {team.user?.email && `• ${team.user.email}`}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Users}
                  title="Aucun membre d'équipe"
                  description="Aucun membre n'a été assigné à cette mission."
                />
              )}
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Équipements ({mission.equipment.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mission.equipment.length > 0 ? (
                <div className="space-y-2">
                  {mission.equipment.map((me) => (
                    <Link
                      key={me.id}
                      href={`/dashboard/equipment/${me.equipment.id}`}
                      className="flex items-center justify-between p-3 bg-muted/50 dark:bg-muted/30 rounded-lg border border-border hover:bg-muted transition-colors duration-150"
                    >
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {me.equipment.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Quantité: {me.quantity}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Package}
                  title="Aucun équipement"
                  description="Aucun équipement n'a été assigné à cette mission."
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

