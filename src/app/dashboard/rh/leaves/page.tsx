/**
 * @file page.tsx
 * @description src/app/dashboard/rh/leaves/page.tsx
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-01
 * @updates 2
 * @lines 151
 * @size 5.81 KB
 */
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import Link from "next/link";
import { Plus, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function LeavesPage() {
  const leaves = await prisma.leave.findMany({
    include: {
      employee: {
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            Congés
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400 mt-1.5">
            Gestion des demandes de congés
          </p>
        </div>
        <Link href="/dashboard/rh/leaves/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle demande
          </Button>
        </Link>
      </div>

      <Card variant="elevated" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Employé
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Période
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
              {leaves.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12">
                    <EmptyState
                      icon={Calendar}
                      title="Aucune demande de congé"
                      description="Commencez par créer une nouvelle demande de congé."
                      action={
                        <Link href="/dashboard/rh/leaves/new">
                          <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Créer une demande
                          </Button>
                        </Link>
                      }
                    />
                  </td>
                </tr>
              ) : (
                leaves.map((leave) => (
                  <tr key={leave.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {leave.employee.user
                          ? `${leave.employee.user.firstName} ${leave.employee.user.lastName}`
                          : `Employé #${leave.employee.employeeNumber}`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-100">{leave.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-100">
                        {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant={
                          leave.status === "approved"
                            ? "success"
                            : leave.status === "rejected"
                            ? "error"
                            : "warning"
                        }
                        size="sm"
                      >
                        {leave.status === "approved"
                          ? "Approuvé"
                          : leave.status === "rejected"
                          ? "Rejeté"
                          : "En attente"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link href={`/dashboard/rh/leaves/${leave.id}`}>
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
    </div>
  );
}

