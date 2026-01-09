/**
 * @file client-page.tsx
 * @description src/app/dashboard/environment/climate/client-page.tsx
 * @author 1
 * @created 2026-01-06
 * @updated 2026-01-06
 * @updates 1
 * @lines 200
 * @size 7.0 KB
 */
"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ExportButtons } from "@/components/export/export-buttons";
import { Pagination } from "@/components/ui/pagination";
import Link from "next/link";
import { Plus, Thermometer } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface ClimateData {
  id: string;
  stationId: string | null;
  location: string;
  latitude: number | null;
  longitude: number | null;
  date: string;
  temperature: number | null;
  humidity: number | null;
  windSpeed: number | null;
  windDirection: number | null;
  precipitation: number | null;
}

export default function ClimateDataPageClient() {
  const [climateData, setClimateData] = useState<ClimateData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await fetch(`/api/climate-data?page=${currentPage}&limit=${pageSize}`);
        if (response.ok) {
          const data = await response.json();
          setClimateData(data.data || []);
          setTotalItems(data.meta?.total || 0);
        }
      } catch (error) {
        console.error("Error fetching climate data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [currentPage, pageSize]);

  const totalPages = Math.ceil(totalItems / pageSize);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
              Données Climatiques
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-400 mt-1.5">
              Liste des mesures climatiques
            </p>
          </div>
        </div>
        <Card variant="elevated" className="p-8">
          <div className="text-center text-gray-500">Chargement...</div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            Données Climatiques
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400 mt-1.5">
            Liste des mesures climatiques
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ExportButtons type="documents" showLabels={false} />
          <Link href="/dashboard/environment/climate/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle mesure
            </Button>
          </Link>
        </div>
      </div>

      <Card variant="elevated" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Station
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
                  Humidité
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Vent
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Précipitations
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
              {climateData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12">
                    <EmptyState
                      icon={Thermometer}
                      title="Aucune mesure climatique enregistrée"
                      description="Commencez par ajouter une nouvelle mesure climatique."
                      action={
                        <Link href="/dashboard/environment/climate/new">
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
                climateData.map((climate) => (
                  <tr key={climate.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Thermometer className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-900 dark:text-gray-100">
                          {climate.stationId || "-"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-100">
                        {climate.location}
                      </div>
                      {climate.latitude && climate.longitude && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {climate.latitude.toFixed(4)}, {climate.longitude.toFixed(4)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {formatDate(climate.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {climate.temperature ? `${climate.temperature}°C` : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {climate.humidity ? `${climate.humidity}%` : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {climate.windSpeed
                        ? `${climate.windSpeed} m/s${climate.windDirection ? ` (${climate.windDirection}°)` : ""}`
                        : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {climate.precipitation ? `${climate.precipitation} mm` : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageSizeChange={setPageSize}
          />
        )}
      </Card>
    </div>
  );
}

