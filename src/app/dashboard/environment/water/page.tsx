/**
 * @file page.tsx
 * @description src/app/dashboard/environment/water/page.tsx
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-04
 * @updates 3
 * @lines 140
 * @size 5.72 KB
 */
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import Link from "next/link";
import { Plus, Droplets } from "lucide-react";
import { formatDate } from "@/lib/utils";

const waterTypeLabels: Record<string, string> = {
  MER: "Mer",
  SOURCE: "Source",
  BARRAGE: "Barrage",
};

// Force dynamic rendering to avoid build-time database queries
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function WaterQualityPage() {
  const waterQuality = await prisma.waterQuality.findMany({
    orderBy: { date: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            Qualité de l&apos;eau
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400 mt-1.5">
            Liste des mesures de qualité de l&apos;eau
          </p>
        </div>
        <Link href="/dashboard/environment/water/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle mesure
          </Button>
        </Link>
      </div>

      <Card variant="elevated" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Localisation
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Température
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  pH
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  O₂ dissous
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
              {waterQuality.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12">
                    <EmptyState
                      icon={Droplets}
                      title="Aucune mesure enregistrée"
                      description="Commencez par ajouter une nouvelle mesure de qualité de l'eau."
                      action={
                        <Link href="/dashboard/environment/water/new">
                          <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Ajouter une mesure
                          </Button>
                        </Link>
                      }
                    />
                  </td>
                </tr>
              ) : (
                waterQuality.map((water) => (
                  <tr key={water.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Droplets className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {waterTypeLabels[water.type] || water.type}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-100">{water.location}</div>
                      {water.latitude && water.longitude && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {water.latitude.toFixed(4)}, {water.longitude.toFixed(4)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {formatDate(water.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {water.temperature ? `${water.temperature}°C` : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {water.ph || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {water.dissolvedO2 ? `${water.dissolvedO2} mg/L` : "-"}
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

