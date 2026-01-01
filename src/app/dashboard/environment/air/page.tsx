/**
 * @file page.tsx
 * @description src/app/dashboard/environment/air/page.tsx
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-01
 * @updates 2
 * @lines 130
 * @size 5.54 KB
 */
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import Link from "next/link";
import { Plus, Cloud } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function AirQualityPage() {
  const airQuality = await prisma.airQuality.findMany({
    orderBy: { date: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            Qualité de l&apos;air
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400 mt-1.5">
            Liste des mesures de qualité de l&apos;air
          </p>
        </div>
        <Link href="/dashboard/environment/air/new">
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
                  Localisation
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  PM2.5
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  PM10
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  NO₂
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  O₃
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
              {airQuality.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12">
                    <EmptyState
                      icon={Cloud}
                      title="Aucune mesure enregistrée"
                      description="Commencez par ajouter une nouvelle mesure de qualité de l'air."
                      action={
                        <Link href="/dashboard/environment/air/new">
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
                airQuality.map((air) => (
                  <tr key={air.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Cloud className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                        <div>
                          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{air.location}</div>
                          {air.latitude && air.longitude && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              {air.latitude.toFixed(4)}, {air.longitude.toFixed(4)}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {formatDate(air.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {air.pm25 ? `${air.pm25} µg/m³` : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {air.pm10 ? `${air.pm10} µg/m³` : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {air.no2 ? `${air.no2} µg/m³` : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {air.o3 ? `${air.o3} µg/m³` : "-"}
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

