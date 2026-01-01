/**
 * @file page.tsx
 * @description src/app/dashboard/rh/employees/page.tsx
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-01
 * @updates 1
 * @lines 164
 * @size 7.09 KB
 */
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import Link from "next/link";
import { Plus, Edit, Eye, Users } from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";

export default async function EmployeesPage() {
  const employees = await prisma.employee.findMany({
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          role: true,
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
            Employés
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400 mt-1.5">
            Liste complète des employés
          </p>
        </div>
        <Link href="/dashboard/rh/employees/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nouvel employé
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
                  Numéro
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Contrat
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Salaire de base
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Date d&apos;embauche
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
              {employees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12">
                    <EmptyState
                      icon={Users}
                      title="Aucun employé"
                      description="Commencez par créer un nouvel employé."
                      action={
                        <Link href="/dashboard/rh/employees/new">
                          <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Créer un employé
                          </Button>
                        </Link>
                      }
                    />
                  </td>
                </tr>
              ) : (
                employees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {employee.user
                          ? `${employee.user.firstName} ${employee.user.lastName}`
                          : `Employé #${employee.employeeNumber}`}
                      </div>
                      {employee.user && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {employee.user.email}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-100">
                        {employee.employeeNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-100">
                        {employee.contractType}
                      </div>
                      {employee.contractEnd && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          Jusqu&apos;au {formatDate(employee.contractEnd)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {formatCurrency(Number(employee.baseSalary))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-100">
                        {formatDate(employee.hireDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant={employee.isActive ? "success" : "error"}
                        size="sm"
                      >
                        {employee.isActive ? "Actif" : "Inactif"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Link href={`/dashboard/rh/employees/${employee.id}`}>
                          <Button variant="ghost" size="sm" title="Voir">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link href={`/dashboard/rh/employees/${employee.id}/edit`}>
                          <Button variant="ghost" size="sm" title="Modifier">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
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

