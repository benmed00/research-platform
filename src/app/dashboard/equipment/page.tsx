/**
 * @file page.tsx
 * @description src/app/dashboard/equipment/page.tsx
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-01
 * @updates 2
 * @lines 263
 * @size 10.09 KB
 */
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import Link from "next/link";
import { Plus, Package, Wrench } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

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

export default async function EquipmentPage() {
  const [equipment, maintenance] = await Promise.all([
    prisma.equipment.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        maintenances: {
          take: 1,
          orderBy: { date: "desc" },
        },
      },
    }),
    prisma.maintenance.findMany({
      where: {
        nextDueDate: {
          lte: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        },
      },
      include: {
        equipment: true,
      },
      take: 5,
      orderBy: { nextDueDate: "asc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Matériel & Logistique
          </h1>
          <p className="text-gray-600 mt-2">
            Gestion de l&apos;inventaire et de la maintenance
          </p>
        </div>
        <Link href="/dashboard/equipment/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nouvel équipement
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total équipements
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {equipment.length}
              </p>
            </div>
            <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
              <Package className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Disponibles
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {equipment.filter((e) => e.status === "AVAILABLE").length}
              </p>
            </div>
            <div className="bg-green-100 text-green-600 p-3 rounded-lg">
              <Package className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                En maintenance
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {equipment.filter((e) => e.status === "MAINTENANCE").length}
              </p>
            </div>
            <div className="bg-yellow-100 text-yellow-600 p-3 rounded-lg">
              <Wrench className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

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
              {equipment.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12">
                    <EmptyState
                      icon={Package}
                      title="Aucun équipement"
                      description="Commencez par ajouter un nouvel équipement à l'inventaire."
                      action={
                        <Link href="/dashboard/equipment/new">
                          <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Ajouter un équipement
                          </Button>
                        </Link>
                      }
                    />
                  </td>
                </tr>
              ) : (
                equipment.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
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
                      <div className="text-sm text-gray-900 dark:text-gray-100">
                        {categoryLabels[item.category] || item.category}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          item.status === "AVAILABLE"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                            : item.status === "IN_USE"
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                            : item.status === "MAINTENANCE"
                            ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300"
                        }`}
                      >
                        {statusLabels[item.status] || item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {item.location || "Non spécifié"}
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
      </Card>

      {maintenance.length > 0 && (
        <Card variant="elevated">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
              Maintenances à prévoir
            </h2>
            <div className="space-y-3">
              {maintenance.map((maint) => (
                <div
                  key={maint.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {maint.equipment.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Prochaine maintenance:{" "}
                      <span className="font-medium">
                        {maint.nextDueDate
                          ? formatDate(maint.nextDueDate)
                          : "Non planifiée"}
                      </span>
                    </p>
                  </div>
                  <Link href={`/dashboard/equipment/${maint.equipmentId}/maintenance`}>
                    <Button variant="outline" size="sm">
                      Planifier
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

