/**
 * @file page.tsx
 * @description src/app/dashboard/rh/page.tsx
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-04
 * @updates 3
 * @lines 242
 * @size 8.56 KB
 */
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Plus, Users, Calendar, DollarSign } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ExportButtons } from "@/components/export/export-buttons";

// HTTP caching for RH page - revalidate every 60 seconds
export const dynamic = 'force-dynamic';
export const revalidate = 60;

export default async function RHPage() {
  const [employees, activeLeaves, recentSalaries] = await Promise.all([
    prisma.employee.findMany({
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
    }),
    prisma.leave.findMany({
      where: {
        status: "approved",
        endDate: { gte: new Date() },
      },
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
      take: 5,
      orderBy: { startDate: "asc" },
    }),
    prisma.salary.findMany({
      where: {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
      },
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
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            Ressources Humaines
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400 mt-1.5">
            Gestion des employés, salaires et congés
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ExportButtons type="employees" />
          <Link href="/dashboard/rh/employees/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouvel employé
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 hover:shadow-md transition-shadow duration-200" variant="elevated">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Total employés
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                {employees.length}
              </p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-3 rounded-xl flex-shrink-0 ml-4 shadow-sm">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow duration-200" variant="elevated">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Congés actifs
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                {activeLeaves.length}
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
                Salaires ce mois
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                {recentSalaries.length}
              </p>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 p-3 rounded-xl flex-shrink-0 ml-4 shadow-sm">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="elevated" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Employés
            </h2>
            <Link href="/dashboard/rh/employees">
              <Button variant="ghost" size="sm">
                Voir tout
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {employees.slice(0, 5).map((employee) => (
              <div
                key={employee.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {employee.user
                      ? `${employee.user.firstName} ${employee.user.lastName}`
                      : `Employé #${employee.employeeNumber}`}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                    {employee.contractType} •{" "}
                    {formatDate(employee.hireDate)}
                  </p>
                </div>
                <Badge
                  variant={employee.isActive ? "success" : "error"}
                  size="sm"
                  className="ml-4 flex-shrink-0"
                >
                  {employee.isActive ? "Actif" : "Inactif"}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card variant="elevated" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Congés en cours
            </h2>
            <Link href="/dashboard/rh/leaves">
              <Button variant="ghost" size="sm">
                Voir tout
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {activeLeaves.length > 0 ? (
              activeLeaves.map((leave) => (
                <div
                  key={leave.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {leave.employee.user
                        ? `${leave.employee.user.firstName} ${leave.employee.user.lastName}`
                        : `Employé #${leave.employee.employeeNumber}`}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                      {formatDate(leave.startDate)} -{" "}
                      {formatDate(leave.endDate)}
                    </p>
                  </div>
                  <Badge variant="info" size="sm" className="ml-4 flex-shrink-0">
                    {leave.type}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="p-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Aucun congé actif
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

