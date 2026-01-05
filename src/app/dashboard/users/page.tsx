/**
 * @file page.tsx
 * @description src/app/dashboard/users/page.tsx
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-04
 * @updates 3
 * @lines 156
 * @size 6.07 KB
 */
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import Link from "next/link";
import { Plus, Edit, Trash2, Users } from "lucide-react";

const roleLabels: Record<string, string> = {
  DIRECTEUR_SCIENTIFIQUE: "Directeur Scientifique",
  DIRECTEUR_ADMINISTRATIF_FINANCIER: "Directeur Administratif & Financier",
  BOTANISTE: "Botaniste",
  ZOOLOGISTE_TERRESTRE: "Zoologiste Terrestre",
  BIOLOGISTE_MARIN: "Biologiste Marin",
  HYDROBIOLOGISTE: "Hydrobiologiste",
  GEOLOGUE: "Géologue",
  CLIMATOLOGUE: "Climatologue",
  DATA_SCIENTIST_SIG: "Data Scientist / SIG",
  INGENIEUR_PLATEFORMES: "Ingénieur Plateformes",
  TECHNICIEN_LABORATOIRE: "Technicien Laboratoire",
  TECHNICIEN_TERRAIN: "Technicien Terrain",
  MARIN_PILOTE_BATEAU: "Marin / Pilote Bateau",
  LOGISTICIEN: "Logisticien",
  COMMUNICATION_EDITION: "Communication / Édition",
};

// Force dynamic rendering to avoid build-time database queries
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      employee: true,
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            Utilisateurs
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400 mt-1.5">
            Gestion des utilisateurs et de leurs permissions
          </p>
        </div>
        <Link href="/dashboard/users/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nouvel utilisateur
          </Button>
        </Link>
      </div>

      <Card variant="elevated" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Rôle
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
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12">
                    <EmptyState
                      icon={Users}
                      title="Aucun utilisateur"
                      description="Commencez par créer un nouvel utilisateur."
                      action={
                        <Link href="/dashboard/users/new">
                          <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Créer un utilisateur
                          </Button>
                        </Link>
                      }
                    />
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {user.firstName} {user.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 dark:text-gray-400">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-100">
                        {roleLabels[user.role] || user.role}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant={user.isActive ? "success" : "error"}
                        size="sm"
                      >
                        {user.isActive ? "Actif" : "Inactif"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Link href={`/dashboard/users/${user.id}/edit`}>
                          <Button variant="ghost" size="sm" title="Modifier">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm" title="Supprimer">
                          <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                        </Button>
                      </div>
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

