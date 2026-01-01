/**
 * @file page.tsx
 * @description src/app/dashboard/missions/page.tsx
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-01
 * @updates 1
 * @lines 241
 * @size 10.06 KB
 */
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import Link from "next/link";
import { Plus, MapPin, Users, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

const statusLabels: Record<string, string> = {
  planned: "Planifiée",
  in_progress: "En cours",
  completed: "Terminée",
  cancelled: "Annulée",
};

export default async function MissionsPage() {
  const missions = await prisma.mission.findMany({
    include: {
      creator: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
      teams: {
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
      _count: {
        select: {
          equipment: true,
        },
      },
    },
    orderBy: { startDate: "desc" },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            Missions & Campagnes Terrain
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400 mt-1.5">
            Gestion des missions scientifiques
          </p>
        </div>
        <Link href="/dashboard/missions/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle mission
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 hover:shadow-md transition-shadow duration-200" variant="elevated">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Total missions
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                {missions.length}
              </p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-3 rounded-xl flex-shrink-0 ml-4 shadow-sm">
              <MapPin className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow duration-200" variant="elevated">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                En cours
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                {missions.filter((m) => m.status === "in_progress").length}
              </p>
            </div>
            <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-3 rounded-xl flex-shrink-0 ml-4 shadow-sm">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow duration-200" variant="elevated">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Terminées
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                {missions.filter((m) => m.status === "completed").length}
              </p>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 p-3 rounded-xl flex-shrink-0 ml-4 shadow-sm">
              <MapPin className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow duration-200" variant="elevated">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Planifiées
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                {missions.filter((m) => m.status === "planned").length}
              </p>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 p-3 rounded-xl flex-shrink-0 ml-4 shadow-sm">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      <Card variant="elevated" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Titre
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Localisation
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Équipe
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
              {missions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12">
                    <EmptyState
                      icon={MapPin}
                      title="Aucune mission"
                      description="Commencez par créer une nouvelle mission terrain."
                      action={
                        <Link href="/dashboard/missions/new">
                          <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Créer une mission
                          </Button>
                        </Link>
                      }
                    />
                  </td>
                </tr>
              ) : (
                missions.map((mission) => (
                  <tr key={mission.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {mission.title}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Par {mission.creator.firstName} {mission.creator.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-100">
                        {mission.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-100">
                        {formatDate(mission.startDate)} -{" "}
                        {formatDate(mission.endDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span className="text-sm text-gray-900 dark:text-gray-100">
                          {mission.teams.length} membre(s)
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {mission._count.equipment} équipement(s)
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
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
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link href={`/dashboard/missions/${mission.id}`}>
                        <Button variant="ghost" size="sm">
                          Voir
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

