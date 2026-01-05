/**
 * @file page.tsx
 * @description src/app/dashboard/equipment/[id]/page.tsx
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-04
 * @updates 3
 * @lines 323
 * @size 12.22 KB
 */
import { prisma } from "@/lib/prisma";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, Edit, Wrench, MapPin, Package, Calendar } from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";
import { notFound } from "next/navigation";

const categoryLabels: Record<string, string> = {
  VEHICULE: "Véhicule",
  BATEAU: "Bateau",
  EQUIPEMENT_SCIENTIFIQUE: "Équipement Scientifique",
  INFORMATIQUE: "Informatique",
  CAMPING_TERRAIN: "Camping & Terrain",
  LABORATOIRE: "Laboratoire",
};

const statusLabels: Record<string, string> = {
  AVAILABLE: "Disponible",
  IN_USE: "En utilisation",
  MAINTENANCE: "En maintenance",
  RETIRED: "Retiré",
};

// Force dynamic rendering to avoid build-time database queries
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function EquipmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const equipment = await prisma.equipment.findUnique({
    where: { id },
    include: {
      maintenances: {
        orderBy: { date: "desc" },
      },
      missionEquipment: {
        include: {
          mission: {
            select: {
              id: true,
              title: true,
              startDate: true,
              endDate: true,
              status: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!equipment) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/equipment">
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
              {equipment.name}
            </h1>
            {equipment.serialNumber && (
              <p className="text-base text-gray-600 dark:text-gray-400 mt-1.5">
                S/N: {equipment.serialNumber}
              </p>
            )}
          </div>
        </div>
        <Link href={`/dashboard/equipment/${equipment.id}/edit`}>
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
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <dt className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                    Catégorie
                  </dt>
                  <dd className="text-base font-medium text-gray-900 dark:text-gray-100">
                    {categoryLabels[equipment.category] || equipment.category}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                    Statut
                  </dt>
                  <dd className="mt-1">
                    <Badge
                      variant={
                        equipment.status === "AVAILABLE"
                          ? "success"
                          : equipment.status === "IN_USE"
                          ? "info"
                          : equipment.status === "MAINTENANCE"
                          ? "warning"
                          : "default"
                      }
                    >
                      {statusLabels[equipment.status] || equipment.status}
                    </Badge>
                  </dd>
                </div>
                {equipment.location && (
                  <div>
                    <dt className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                      Localisation
                    </dt>
                    <dd className="text-base text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      {equipment.location}
                    </dd>
                  </div>
                )}
                {equipment.purchaseDate && (
                  <div>
                    <dt className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                      Date d&apos;achat
                    </dt>
                    <dd className="text-base text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      {formatDate(equipment.purchaseDate)}
                    </dd>
                  </div>
                )}
                {equipment.purchasePrice && (
                  <div>
                    <dt className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                      Prix d&apos;achat
                    </dt>
                    <dd className="text-base font-medium text-gray-900 dark:text-gray-100">
                      {formatCurrency(Number(equipment.purchasePrice))}
                    </dd>
                  </div>
                )}
                {equipment.lifespan && (
                  <div>
                    <dt className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                      Durée de vie
                    </dt>
                    <dd className="text-base text-gray-900 dark:text-gray-100">
                      {equipment.lifespan} années
                    </dd>
                  </div>
                )}
                {equipment.description && (
                  <div className="col-span-1 md:col-span-2">
                    <dt className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                      Description
                    </dt>
                    <dd className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                      {equipment.description}
                    </dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>

          {equipment.maintenances.length > 0 && (
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="w-5 h-5" />
                  Historique de maintenance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {equipment.maintenances.map((maint) => (
                    <div
                      key={maint.id}
                      className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3 flex-wrap">
                            <Badge variant="info" size="sm">
                              {maint.type}
                            </Badge>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {formatDate(maint.date)}
                            </span>
                          </div>
                          {maint.description && (
                            <p className="text-sm text-gray-900 dark:text-gray-100 leading-relaxed">
                              {maint.description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 flex-wrap text-xs text-gray-600 dark:text-gray-400">
                            {maint.cost && (
                              <span>
                                Coût: <span className="font-medium">{formatCurrency(Number(maint.cost))}</span>
                              </span>
                            )}
                            {maint.nextDueDate && (
                              <span>
                                Prochaine: {formatDate(maint.nextDueDate)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {equipment.missionEquipment.length > 0 && (
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Missions associées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {equipment.missionEquipment.map((me) => (
                    <Link
                      key={me.id}
                      href={`/dashboard/missions/${me.mission.id}`}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-colors duration-200"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                          {me.mission.title}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {formatDate(me.mission.startDate)} - {formatDate(me.mission.endDate)}
                        </p>
                      </div>
                      <Badge
                        variant={
                          me.mission.status === "completed"
                            ? "success"
                            : me.mission.status === "in_progress"
                            ? "info"
                            : "warning"
                        }
                        size="sm"
                        className="ml-4 flex-shrink-0"
                      >
                        {me.mission.status}
                      </Badge>
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
              <CardTitle>Statistiques</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-6">
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <dt className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    Maintenances
                  </dt>
                  <dd className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {equipment.maintenances.length}
                  </dd>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <dt className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    Missions
                  </dt>
                  <dd className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {equipment.missionEquipment.length}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

