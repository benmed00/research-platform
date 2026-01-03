"use client";

import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import Link from "next/link";
import { Plus, MapPin, Users, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { ExportButtons } from "@/components/export/export-buttons";
import { MissionsFiltersPanel, MissionsFilters } from "@/components/filters/missions-filters";
import { MissionsCharts } from "@/components/charts/missions-charts";
import { Pagination } from "@/components/ui/pagination";
import { ImportButton } from "@/components/import/import-button";

const statusLabels: Record<string, string> = {
  planned: "Planifiée",
  in_progress: "En cours",
  completed: "Terminée",
  cancelled: "Annulée",
};

interface Mission {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  startDate: string;
  endDate: string | null;
  status: string;
  creator: {
    firstName: string;
    lastName: string;
  };
  teams: Array<{
    user: {
      firstName: string;
      lastName: string;
    };
  }>;
  _count: {
    equipment: number;
  };
}

export default function MissionsPageClient() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<MissionsFilters>({
    search: "",
    status: [],
    dateFrom: "",
    dateTo: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await fetch("/api/missions");
        if (response.ok) {
          const data = await response.json();
          setMissions(data);
        }
      } catch (error) {
        console.error("Error fetching missions:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Filter missions based on filters
  const filteredMissions = useMemo(() => {
    const filtered = missions.filter((m) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          m.title.toLowerCase().includes(searchLower) ||
          (m.description && m.description.toLowerCase().includes(searchLower)) ||
          (m.location && m.location.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(m.status)) {
        return false;
      }

      // Date filters
      if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom);
        const startDate = new Date(m.startDate);
        if (startDate < fromDate) return false;
      }

      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo);
        toDate.setHours(23, 59, 59, 999); // End of day
        const endDate = m.endDate ? new Date(m.endDate) : new Date(m.startDate);
        if (endDate > toDate) return false;
      }

      return true;
    });
    return filtered;
  }, [missions, filters]);

  // Pagination
  const paginatedMissions = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredMissions.slice(startIndex, endIndex);
  }, [filteredMissions, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredMissions.length / pageSize);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const stats = useMemo(() => {
    return {
      total: filteredMissions.length,
      inProgress: filteredMissions.filter((m) => m.status === "in_progress").length,
      completed: filteredMissions.filter((m) => m.status === "completed").length,
      planned: filteredMissions.filter((m) => m.status === "planned").length,
    };
  }, [filteredMissions]);

  if (loading) {
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
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

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
        <div className="flex items-center gap-3">
          <ImportButton type="missions" onImportSuccess={() => window.location.reload()} />
          <ExportButtons
            type="missions"
            filters={{
              ...(filters.status.length > 0 && { status: { in: filters.status } }),
              ...(filters.dateFrom && { startDate: { gte: new Date(filters.dateFrom).toISOString() } }),
              ...(filters.dateTo && { endDate: { lte: new Date(filters.dateTo).toISOString() } }),
              ...(filters.search && {
                OR: [
                  { title: { contains: filters.search, mode: "insensitive" } },
                  { description: { contains: filters.search, mode: "insensitive" } },
                  { location: { contains: filters.search, mode: "insensitive" } },
                ],
              }),
            }}
          />
          <Link href="/dashboard/missions/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle mission
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 hover:shadow-md transition-shadow duration-200" variant="elevated">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Total missions
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                {stats.total}
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
                {stats.inProgress}
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
                {stats.completed}
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
                {stats.planned}
              </p>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 p-3 rounded-xl flex-shrink-0 ml-4 shadow-sm">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* Graphiques avancés */}
      <MissionsCharts missions={filteredMissions} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <MissionsFiltersPanel
            filters={filters}
            onFiltersChange={setFilters}
            resultCount={filteredMissions.length}
          />
        </div>

        <div className="lg:col-span-3">
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
                  {filteredMissions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12">
                        <EmptyState
                          icon={MapPin}
                          title="Aucune mission trouvée"
                          description={
                            filters.search || filters.status.length > 0 || filters.dateFrom || filters.dateTo
                              ? "Essayez de modifier vos filtres de recherche."
                              : "Commencez par créer une nouvelle mission terrain."
                          }
                          action={
                            !filters.search && filters.status.length === 0 && !filters.dateFrom && !filters.dateTo ? (
                              <Link href="/dashboard/missions/new">
                                <Button>
                                  <Plus className="w-4 h-4 mr-2" />
                                  Créer une mission
                                </Button>
                              </Link>
                            ) : (
                              <Button variant="outline" onClick={() => setFilters({ search: "", status: [], dateFrom: "", dateTo: "" })}>
                                Effacer les filtres
                              </Button>
                            )
                          }
                        />
                      </td>
                    </tr>
                  ) : (
                    paginatedMissions.map((mission) => (
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
                            {mission.location || "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-gray-100">
                            {formatDate(mission.startDate)} - {mission.endDate ? formatDate(mission.endDate) : "En cours"}
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
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                pageSize={pageSize}
                totalItems={filteredMissions.length}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setCurrentPage(1);
                }}
                className="border-t"
              />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

