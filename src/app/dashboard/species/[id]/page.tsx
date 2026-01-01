/**
 * @file page.tsx
 * @description src/app/dashboard/species/[id]/page.tsx
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-01
 * @updates 1
 * @lines 345
 * @size 12.77 KB
 */
import { prisma } from "@/lib/prisma";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { EmptyState } from "@/components/ui/empty-state";
import Link from "next/link";
import { ArrowLeft, Edit, MapPin, Camera, BookOpen, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { notFound } from "next/navigation";

const typeLabels: Record<string, string> = {
  FLORE_TERRESTRE: "Flore Terrestre",
  FAUNE_TERRESTRE: "Faune Terrestre",
  FAUNE_MARINE: "Faune Marine",
  ESPECE_EAU_DOUCE: "Espèce Eau Douce",
};

const iucnLabels: Record<string, string> = {
  LC: "Préoccupation mineure",
  NT: "Quasi menacé",
  VU: "Vulnérable",
  EN: "En danger",
  CR: "En danger critique",
  EW: "Éteint à l&apos;état sauvage",
  EX: "Éteint",
  DD: "Données insuffisantes",
  NE: "Non évalué",
};

export default async function SpeciesDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const species = await prisma.species.findUnique({
    where: { id },
    include: {
      observations: {
        take: 10,
        orderBy: { date: "desc" },
        include: {
          mission: {
            select: {
              title: true,
            },
          },
        },
      },
      locations: {
        take: 10,
        orderBy: { observedAt: "desc" },
      },
      photos: {
        take: 10,
        orderBy: { createdAt: "desc" },
      },
      references: {
        take: 10,
        orderBy: { createdAt: "desc" },
      },
      _count: {
        select: {
          observations: true,
          locations: true,
          photos: true,
          references: true,
        },
      },
    },
  });

  if (!species) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/species">
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
              {species.scientificName}
            </h1>
            {species.commonName && (
              <p className="text-base text-gray-600 dark:text-gray-400 mt-1.5">
                {species.commonName}
              </p>
            )}
          </div>
        </div>
        <Link href={`/dashboard/species/${species.id}/edit`}>
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
                  <Label>Type</Label>
                  <p className="mt-1 text-sm text-foreground">
                    {typeLabels[species.type] || species.type}
                  </p>
                </div>
                <div>
                  <Label>Statut UICN</Label>
                  <div className="mt-1">
                    {species.iucnStatus ? (
                      <Badge
                        variant={
                          species.iucnStatus === "CR" || species.iucnStatus === "EN"
                            ? "error"
                            : species.iucnStatus === "VU" || species.iucnStatus === "NT"
                            ? "warning"
                            : "info"
                        }
                        size="sm"
                      >
                        {species.iucnStatus} - {iucnLabels[species.iucnStatus]}
                      </Badge>
                    ) : (
                      <span className="text-sm text-muted-foreground">Non spécifié</span>
                    )}
                  </div>
                </div>
                {species.habitat && (
                  <div className="col-span-full">
                    <Label>Habitat</Label>
                    <p className="mt-1 text-sm text-foreground">{species.habitat}</p>
                  </div>
                )}
                {species.description && (
                  <div className="col-span-full">
                    <Label>Description</Label>
                    <p className="mt-1 text-sm text-foreground whitespace-pre-wrap">
                      {species.description}
                    </p>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Observations récentes</CardTitle>
            </CardHeader>
            <CardContent>
              {species.observations.length > 0 ? (
                <div className="space-y-3">
                  {species.observations.map((obs) => (
                    <div
                      key={obs.id}
                      className="p-4 bg-muted/50 dark:bg-muted/30 rounded-lg border border-border hover:bg-muted transition-colors duration-150 ease-in-out"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-semibold text-foreground">
                              {formatDate(obs.date)}
                            </span>
                          </div>
                          {obs.location && (
                            <div className="flex items-center gap-2 mb-2">
                              <MapPin className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm text-foreground">{obs.location}</span>
                            </div>
                          )}
                          {obs.quantity && (
                            <p className="text-sm text-muted-foreground mb-2">
                              Quantité observée: <span className="font-medium text-foreground">{obs.quantity}</span>
                            </p>
                          )}
                          {obs.notes && (
                            <p className="text-sm text-foreground mt-2">{obs.notes}</p>
                          )}
                          {obs.mission && (
                            <p className="text-xs text-muted-foreground mt-2">
                              Mission: {obs.mission.title}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Calendar}
                  title="Aucune observation enregistrée"
                  description="Les observations de cette espèce apparaîtront ici."
                />
              )}
            </CardContent>
          </Card>

          {species.locations.length > 0 && (
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Localisations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {species.locations.map((loc) => (
                    <div
                      key={loc.id}
                      className="flex items-center gap-2 p-3 bg-muted/50 dark:bg-muted/30 rounded-lg border border-border hover:bg-muted transition-colors duration-150"
                    >
                      <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground">
                          {loc.location || "Localisation"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {loc.latitude}, {loc.longitude} • {formatDate(loc.observedAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Statistiques</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div>
                  <Label>Observations</Label>
                  <p className="mt-1 text-2xl font-bold text-foreground">
                    {species._count.observations}
                  </p>
                </div>
                <div>
                  <Label>Localisations</Label>
                  <p className="mt-1 text-2xl font-bold text-foreground">
                    {species._count.locations}
                  </p>
                </div>
                <div>
                  <Label>Photos</Label>
                  <p className="mt-1 text-2xl font-bold text-foreground">
                    {species._count.photos}
                  </p>
                </div>
                <div>
                  <Label>Références</Label>
                  <p className="mt-1 text-2xl font-bold text-foreground">
                    {species._count.references}
                  </p>
                </div>
              </dl>
            </CardContent>
          </Card>

          {species.photos.length > 0 && (
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-primary" />
                  Photos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {species.photos.map((photo) => (
                    <div
                      key={photo.id}
                      className="aspect-square bg-muted rounded-lg overflow-hidden border border-border hover:shadow-md transition-shadow duration-200"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo.url}
                        alt={photo.caption || species.scientificName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {species.references.length > 0 && (
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Références
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {species.references.map((ref) => (
                    <div
                      key={ref.id}
                      className="p-3 bg-muted/50 dark:bg-muted/30 rounded-lg border border-border hover:bg-muted transition-colors duration-150"
                    >
                      <p className="font-semibold text-sm text-foreground">{ref.title}</p>
                      {ref.authors && (
                        <p className="text-xs text-muted-foreground mt-1">{ref.authors}</p>
                      )}
                      {ref.journal && (
                        <p className="text-xs text-muted-foreground mt-0.5">{ref.journal}</p>
                      )}
                      {ref.year && (
                        <p className="text-xs text-muted-foreground mt-0.5">{ref.year}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

