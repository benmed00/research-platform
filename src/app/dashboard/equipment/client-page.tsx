"use client";

import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import Link from "next/link";
import { Plus, Package, Wrench } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ExportButtons } from "@/components/export/export-buttons";
import { EquipmentFiltersPanel, EquipmentFilters } from "@/components/filters/equipment-filters";
import { Pagination } from "@/components/ui/pagination";
import { ImportButton } from "@/components/import/import-button";

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

interface Equipment {
  id: string;
  name: string;
  category: string;
  serialNumber: string | null;
  status: string;
  location: string | null;
  purchasePrice: number | null;
  maintenances: Array<{
    date: string;
  }>;
}

export default function EquipmentPageClient() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [maintenance, setMaintenance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<EquipmentFilters>({
    search: "",
    category: [],
    status: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [equipmentRes, maintenanceRes] = await Promise.all([
          fetch("/api/equipment"),
          fetch("/api/equipment/maintenance?limit=5"),
        ]);

        if (equipmentRes.ok) {
          const data = await equipmentRes.json();
          setEquipment(data);
        }

        if (maintenanceRes.ok) {
          const data = await maintenanceRes.json();
          setMaintenance(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Error fetching equipment data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Filter equipment based on filters
  const filteredEquipment = useMemo(() => {
    const filtered = equipment.filter((e) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          e.name.toLowerCase().includes(searchLower) ||
          (e.serialNumber && e.serialNumber.toLowerCase().includes(searchLower)) ||
          (e.location && e.location.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }

      // Category filter
      if (filters.category.length > 0 && !filters.category.includes(e.category)) {
        return false;
      }

      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(e.status)) {
        return false;
      }

      return true;
    });
    return filtered;
  }, [equipment, filters]);

  // Pagination
  const paginatedEquipment = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredEquipment.slice(startIndex, endIndex);
  }, [filteredEquipment, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredEquipment.length / pageSize);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const stats = useMemo(() => {
    return {
      total: filteredEquipment.length,
      available: filteredEquipment.filter((e) => e.status === "AVAILABLE").length,
      maintenance: filteredEquipment.filter((e) => e.status === "MAINTENANCE").length,
    };
  }, [filteredEquipment]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Matériel & Logistique
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Gestion de l&apos;inventaire et de la maintenance
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Matériel & Logistique
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Gestion de l&apos;inventaire et de la maintenance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ImportButton type="equipment" onImportSuccess={() => window.location.reload()} />
          <ExportButtons
            type="equipment"
            filters={{
              ...(filters.category.length > 0 && { category: { in: filters.category } }),
              ...(filters.status.length > 0 && { status: { in: filters.status } }),
              ...(filters.search && {
                OR: [
                  { name: { contains: filters.search, mode: "insensitive" } },
                  { serialNumber: { contains: filters.search, mode: "insensitive" } },
                  { location: { contains: filters.search, mode: "insensitive" } },
                ],
              }),
            }}
          />
          <Link href="/dashboard/equipment/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouvel équipement
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6" variant="elevated">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total équipements
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                {stats.total}
              </p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-3 rounded-lg">
              <Package className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="p-6" variant="elevated">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Disponibles
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                {stats.available}
              </p>
            </div>
            <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-3 rounded-lg">
              <Package className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="p-6" variant="elevated">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                En maintenance
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                {stats.maintenance}
              </p>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 p-3 rounded-lg">
              <Wrench className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <EquipmentFiltersPanel
            filters={filters}
            onFiltersChange={setFilters}
            resultCount={filteredEquipment.length}
          />
        </div>

        <div className="lg:col-span-3">
          <Card className="overflow-hidden" variant="elevated">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Nom
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Catégorie
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Localisation
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                  {filteredEquipment.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12">
                        <EmptyState
                          icon={Package}
                          title="Aucun équipement trouvé"
                          description={
                            filters.search || filters.category.length > 0 || filters.status.length > 0
                              ? "Essayez de modifier vos filtres de recherche."
                              : "Commencez par ajouter un nouvel équipement à l'inventaire."
                          }
                          action={
                            !filters.search && filters.category.length === 0 && filters.status.length === 0 ? (
                              <Link href="/dashboard/equipment/new">
                                <Button>
                                  <Plus className="w-4 h-4 mr-2" />
                                  Ajouter un équipement
                                </Button>
                              </Link>
                            ) : (
                              <Button variant="outline" onClick={() => setFilters({ search: "", category: [], status: [] })}>
                                Effacer les filtres
                              </Button>
                            )
                          }
                        />
                      </td>
                    </tr>
                  ) : (
                    paginatedEquipment.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150">
                        <td className="px-6 py-4">
                          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {item.name}
                          </div>
                          {item.serialNumber && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              S/N: {item.serialNumber}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="info" size="sm">
                            {categoryLabels[item.category] || item.category}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge
                            variant={
                              item.status === "AVAILABLE"
                                ? "success"
                                : item.status === "MAINTENANCE"
                                ? "warning"
                                : item.status === "RETIRED"
                                ? "error"
                                : "default"
                            }
                            size="sm"
                          >
                            {statusLabels[item.status] || item.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-gray-100">
                            {item.location || "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link href={`/dashboard/equipment/${item.id}`}>
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
                totalItems={filteredEquipment.length}
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

      {maintenance.length > 0 && (
        <Card variant="elevated" className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Maintenances à venir
          </h2>
          <div className="space-y-3">
            {maintenance.map((m: any) => (
              <div
                key={m.id}
                className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                  {m.equipment?.name || "Équipement inconnu"}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Prochaine maintenance: {m.nextDueDate ? formatDate(m.nextDueDate) : "N/A"}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

