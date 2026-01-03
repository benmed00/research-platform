"use client";

import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import Link from "next/link";
import { Plus, Database, MapPin } from "lucide-react";
import { ExportButtons } from "@/components/export/export-buttons";
import { SpeciesFiltersPanel, SpeciesFilters } from "@/components/filters/species-filters";
import { Pagination } from "@/components/ui/pagination";
import { SpeciesCharts } from "@/components/charts/species-charts";
import { ImportButton } from "@/components/import/import-button";

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
  EW: "Éteint à l'état sauvage",
  EX: "Éteint",
  DD: "Données insuffisantes",
  NE: "Non évalué",
};

interface Species {
  id: string;
  scientificName: string;
  commonName: string | null;
  type: string;
  iucnStatus: string | null;
  habitat: string | null;
  _count: {
    observations: number;
    locations: number;
    photos: number;
  };
}

export default function SpeciesPageClient() {
  const [species, setSpecies] = useState<Species[]>([]);
  const [observations, setObservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SpeciesFilters>({
    search: "",
    type: [],
    iucnStatus: [],
    habitat: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [speciesRes, observationsRes] = await Promise.all([
          fetch("/api/species"),
          fetch("/api/species/observations?limit=500"), // Plus de données pour les graphiques
        ]);

        if (speciesRes.ok) {
          const data = await speciesRes.json();
          setSpecies(data);
        }

        if (observationsRes.ok) {
          const data = await observationsRes.json();
          setObservations(Array.isArray(data) ? data : data.data || []);
        }
      } catch (error) {
        console.error("Error fetching species data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Filter species based on filters
  const filteredSpecies = useMemo(() => {
    const filtered = species.filter((s) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          s.scientificName.toLowerCase().includes(searchLower) ||
          (s.commonName && s.commonName.toLowerCase().includes(searchLower)) ||
          (s.habitat && s.habitat.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }

      // Type filter
      if (filters.type.length > 0 && !filters.type.includes(s.type)) {
        return false;
      }

      // IUCN Status filter
      if (filters.iucnStatus.length > 0) {
        if (!s.iucnStatus || !filters.iucnStatus.includes(s.iucnStatus)) {
          return false;
        }
      }

      // Habitat filter
      if (filters.habitat) {
        const habitatLower = filters.habitat.toLowerCase();
        if (!s.habitat || !s.habitat.toLowerCase().includes(habitatLower)) {
          return false;
        }
      }

      return true;
    });
    return filtered;
  }, [species, filters]);

  // Pagination
  const paginatedSpecies = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredSpecies.slice(startIndex, endIndex);
  }, [filteredSpecies, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredSpecies.length / pageSize);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const statsByType = useMemo(() => {
    return filteredSpecies.reduce((acc, s) => {
      acc[s.type] = (acc[s.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [filteredSpecies]);

  if (loading) {
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
            Base de Données Scientifique - Espèces
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400 mt-1.5">
            Catalogue des espèces étudiées
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ImportButton type="species" onImportSuccess={() => window.location.reload()} />
          <ExportButtons
            type="species"
            filters={{
              ...(filters.type.length > 0 && { type: { in: filters.type } }),
              ...(filters.iucnStatus.length > 0 && { iucnStatus: { in: filters.iucnStatus } }),
              ...(filters.habitat && { habitat: { contains: filters.habitat, mode: "insensitive" } }),
              ...(filters.search && {
                OR: [
                  { scientificName: { contains: filters.search, mode: "insensitive" } },
                  { commonName: { contains: filters.search, mode: "insensitive" } },
                  { habitat: { contains: filters.search, mode: "insensitive" } },
                ],
              }),
            }}
          />
          <Link href="/dashboard/species/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle espèce
            </Button>
          </Link>
        </div>
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
          <Card
            key={type}
            className="p-6 hover:shadow-md transition-shadow duration-200"
            variant="elevated"
          >
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
                <MapPin className="w-6 h-6" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Graphiques avancés */}
      <SpeciesCharts species={filteredSpecies} observations={observations} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <SpeciesFiltersPanel
            filters={filters}
            onFiltersChange={setFilters}
            resultCount={filteredSpecies.length}
          />
        </div>

        <div className="lg:col-span-2">
          <Card variant="elevated" className="overflow-hidden">
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
                  {filteredSpecies.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12">
                        <EmptyState
                          icon={Database}
                          title="Aucune espèce trouvée"
                          description={
                            filters.search || filters.type.length > 0 || filters.iucnStatus.length > 0 || filters.habitat
                              ? "Essayez de modifier vos filtres de recherche."
                              : "Commencez par ajouter une nouvelle espèce au catalogue."
                          }
                          action={
                            !filters.search && filters.type.length === 0 && filters.iucnStatus.length === 0 && !filters.habitat ? (
                              <Link href="/dashboard/species/new">
                                <Button>
                                  <Plus className="w-4 h-4 mr-2" />
                                  Ajouter une espèce
                                </Button>
                              </Link>
                            ) : (
                              <Button variant="outline" onClick={() => setFilters({ search: "", type: [], iucnStatus: [], habitat: "" })}>
                                Effacer les filtres
                              </Button>
                            )
                          }
                        />
                      </td>
                    </tr>
                  ) : (
                    paginatedSpecies.map((s) => (
                      <tr
                        key={s.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4">
                          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {s.scientificName}
                          </div>
                          {s.commonName && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              {s.commonName}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="info" size="sm">
                            {typeLabels[s.type] || s.type}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {s.iucnStatus ? (
                            <Badge
                              variant={
                                s.iucnStatus === "CR" || s.iucnStatus === "EN"
                                  ? "error"
                                  : s.iucnStatus === "VU"
                                  ? "warning"
                                  : "default"
                              }
                              size="sm"
                            >
                              {iucnLabels[s.iucnStatus] || s.iucnStatus}
                            </Badge>
                          ) : (
                            <span className="text-xs text-gray-400">Non évalué</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-gray-100">
                            {s._count.observations} obs.
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {s._count.locations} loc. • {s._count.photos} photos
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link href={`/dashboard/species/${s.id}`}>
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
                totalItems={filteredSpecies.length}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setCurrentPage(1);
                }}
                className="border-t"
              />
            )}
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card variant="elevated" className="p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
              Observations récentes
            </h2>
            <div className="space-y-3">
              {observations.length > 0 ? (
                observations.map((obs: any) => (
                  <div
                    key={obs.id}
                    className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                  >
                    <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                      {obs.species?.scientificName || "Espèce inconnue"}
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
    </div>
  );
}

