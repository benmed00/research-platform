/**
 * @file page.tsx
 * @description src/app/dashboard/environment/page.tsx
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-01
 * @updates 2
 * @lines 236
 * @size 9.10 KB
 */
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Droplets, Cloud, Thermometer, MapPin } from "lucide-react";
import { formatDate } from "@/lib/utils";

const waterTypeLabels: Record<string, string> = {
  MER: "Mer",
  SOURCE: "Source",
  BARRAGE: "Barrage",
};

export default async function EnvironmentPage() {
  const [waterQuality, airQuality, climateData, sensorData, counts] = await Promise.all([
    prisma.waterQuality.findMany({
      take: 10,
      orderBy: { date: "desc" },
    }),
    prisma.airQuality.findMany({
      take: 10,
      orderBy: { date: "desc" },
    }),
    prisma.climateData.findMany({
      take: 10,
      orderBy: { date: "desc" },
    }),
    prisma.sensorData.findMany({
      take: 10,
      orderBy: { timestamp: "desc" },
    }),
    Promise.all([
      prisma.waterQuality.count(),
      prisma.airQuality.count(),
      prisma.climateData.count(),
      prisma.sensorData.count(),
    ]),
  ]);

  const [totalWaterQuality, totalAirQuality, totalClimateData, totalSensorData] = counts;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            Données Environnementales
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400 mt-1.5">
            Qualité de l&apos;eau, de l&apos;air, climat et géologie
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/environment/water/new">
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Eau
            </Button>
          </Link>
          <Link href="/dashboard/environment/air/new">
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Air
            </Button>
          </Link>
          <Link href="/dashboard/environment/climate/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Climat
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 hover:shadow-md transition-shadow duration-200" variant="elevated">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Qualité de l&apos;eau
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                {totalWaterQuality}
              </p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-3 rounded-xl flex-shrink-0 ml-4 shadow-sm">
              <Droplets className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow duration-200" variant="elevated">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Qualité de l&apos;air
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                {totalAirQuality}
              </p>
            </div>
            <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-3 rounded-xl flex-shrink-0 ml-4 shadow-sm">
              <Cloud className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow duration-200" variant="elevated">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Données climatiques
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                {totalClimateData}
              </p>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 p-3 rounded-xl flex-shrink-0 ml-4 shadow-sm">
              <Thermometer className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow duration-200" variant="elevated">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Données capteurs
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                {totalSensorData}
              </p>
            </div>
            <div className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 p-3 rounded-xl flex-shrink-0 ml-4 shadow-sm">
              <MapPin className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="elevated" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Qualité de l&apos;eau récente
            </h2>
            <Link href="/dashboard/environment/water">
              <Button variant="ghost" size="sm">
                Voir tout
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {waterQuality.length > 0 ? (
              waterQuality.map((water) => (
                <div
                  key={water.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {waterTypeLabels[water.type] || water.type} - {water.location}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                      {formatDate(water.date)}
                      {water.temperature && ` • ${water.temperature}°C`}
                      {water.ph && ` • pH: ${water.ph}`}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Aucune donnée récente
                </p>
              </div>
            )}
          </div>
        </Card>

        <Card variant="elevated" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Qualité de l&apos;air récente
            </h2>
            <Link href="/dashboard/environment/air">
              <Button variant="ghost" size="sm">
                Voir tout
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {airQuality.length > 0 ? (
              airQuality.map((air) => (
                <div
                  key={air.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {air.location}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                      {formatDate(air.date)}
                      {air.pm25 && ` • PM2.5: ${air.pm25}`}
                      {air.pm10 && ` • PM10: ${air.pm10}`}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Aucune donnée récente
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

