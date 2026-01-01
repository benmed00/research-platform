/**
 * @file page.tsx
 * @description src/app/dashboard/species/page.tsx
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-01
 * @updates 2
 * @lines 257
 * @size 10.34 KB
 */
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import Link from "next/link";
import { Plus, Database, MapPin } from "lucide-react";

const typeLabels: Record<string, string> = {
  FLORE_TERRESTRE: "Flore Terrestre",
  FAUNE_TERRESTRE: "Faune Terrestre",
  FAUNE_MARINE: "Faune Marine",
  ESPECE_EAU_DOUCE: "Espèce Eau Douce",
};

// Force dynamic rendering to avoid build-time database queries
export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

export default async function SpeciesPage() {
  const [species, observations] = await Promise.all([
    prisma.species.findMany({
      include: {
        _count: {
          select: {
            observations: true,
            locations: true,
            photos: true,
          },
        },
      },
      orderBy: { scientificName: "asc" },
    }),
    prisma.speciesObservation.findMany({
      take: 10,
      orderBy: { date: "desc" },
      include: {
        species: true,
      },
    }),
  ]);

  const statsByType = species.reduce((acc, s) => {
    acc[s.type] = (acc[s.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            Base de Données Scientifique - Espèces
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400 mt-1.5">
            Catalogue des espèces étudiées
          </p>
        </div>
        <Link href="/dashboard/species/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle espèce
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 hover:shadow-md transition-shadow duration-200" variant="elevated">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Total espèces
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                {species.length}
              </p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-3 rounded-xl flex-shrink-0 ml-4 shadow-sm">
              <Database className="w-6 h-6" />
            </div>
          </div>
        </Card>

        {Object.entries(statsByType).map(([type, count]) => (
          <Card key={type} className="p-6 hover:shadow-md transition-shadow duration-200" variant="elevated">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  {typeLabels[type] || type}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                  {count}
                </p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-3 rounded-xl flex-shrink-0 ml-4 shadow-sm">
                <Database className="w-6 h-6" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card variant="elevated" className="lg:col-span-2 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Espèces cataloguées
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Nom scientifique
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Statut UICN
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Observations
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                {species.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12">
                      <EmptyState
                        icon={Database}
                        title="Aucune espèce"
                        description="Commencez par ajouter une nouvelle espèce au catalogue."
                        action={
                          <Link href="/dashboard/species/new">
                            <Button>
                              <Plus className="w-4 h-4 mr-2" />
                              Ajouter une espèce
                            </Button>
                          </Link>
                        }
                      />
                    </td>
                  </tr>
                ) : (
                  species.slice(0, 10).map((spec) => (
                    <tr key={spec.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {spec.scientificName}
                        </div>
                        {spec.commonName && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {spec.commonName}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-100">
                          {typeLabels[spec.type] || spec.type}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {spec.iucnStatus ? (
                          <Badge variant="info" size="sm">
                            {iucnLabels[spec.iucnStatus] || spec.iucnStatus}
                          </Badge>
                        ) : (
                          <span className="text-sm text-gray-400 dark:text-gray-500">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-100">
                          {spec._count.observations} obs.
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {spec._count.locations} localisations
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link href={`/dashboard/species/${spec.id}`}>
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

        <Card variant="elevated" className="p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
            Observations récentes
          </h2>
          <div className="space-y-3">
            {observations.length > 0 ? (
              observations.map((obs) => (
                <div
                  key={obs.id}
                  className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                    {obs.species.scientificName}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {new Date(obs.date).toLocaleDateString("fr-FR")}
                    {obs.location && ` • ${obs.location}`}
                  </p>
                  {obs.quantity && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      Quantité: <span className="font-medium">{obs.quantity}</span>
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="p-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Aucune observation récente
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

