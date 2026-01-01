/**
 * @file page.tsx
 * @description src/app/dashboard/rh/employees/[id]/page.tsx
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-01
 * @updates 2
 * @lines 416
 * @size 14.88 KB
 */
import { prisma } from "@/lib/prisma";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { EmptyState } from "@/components/ui/empty-state";
import Link from "next/link";
import { ArrowLeft, Edit, User, Calendar, DollarSign, Award, FileText, MapPin } from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";
import { notFound } from "next/navigation";

const contractTypeLabels: Record<string, string> = {
  CDI: "CDI",
  CDD: "CDD",
  STAGE: "Stage",
  CONSULTANT: "Consultant",
};

// Force dynamic rendering to avoid build-time database queries
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function EmployeeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const employee = await prisma.employee.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          isActive: true,
        },
      },
      salaries: {
        orderBy: { createdAt: "desc" },
      },
      bonuses: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      leaves: {
        orderBy: { startDate: "desc" },
        take: 10,
      },
      evaluations: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
      missionAssignments: {
        include: {
          mission: {
            select: {
              id: true,
              title: true,
              startDate: true,
              endDate: true,
              status: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      },
    },
  });

  if (!employee) {
    notFound();
  }

  const fullName = employee.user
    ? `${employee.user.firstName} ${employee.user.lastName}`
    : "Non assigné";

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/rh/employees">
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
              {fullName}
            </h1>
            {employee.employeeNumber && (
              <p className="text-base text-gray-600 dark:text-gray-400 mt-1.5">
                N° Employé: {employee.employeeNumber}
              </p>
            )}
          </div>
        </div>
        <Link href={`/dashboard/rh/employees/${employee.id}/edit`}>
          <Button>
            <Edit className="w-4 h-4 mr-2" />
            Modifier
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Informations Personnelles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              {employee.user && (
                <>
                  <div>
                    <Label>Email</Label>
                    <p className="mt-1 text-sm text-foreground font-medium">
                      {employee.user.email}
                    </p>
                  </div>
                  <div>
                    <Label>Rôle</Label>
                    <p className="mt-1 text-sm text-foreground font-medium">
                      {employee.user.role}
                    </p>
                  </div>
                  <div>
                    <Label>Statut</Label>
                    <div className="mt-1">
                      <Badge
                        variant={employee.user.isActive ? "success" : "error"}
                        size="sm"
                      >
                        {employee.user.isActive ? "Actif" : "Inactif"}
                      </Badge>
                    </div>
                  </div>
                </>
              )}
              {employee.employeeNumber && (
                <div>
                  <Label>N° Employé</Label>
                  <p className="mt-1 text-sm text-foreground font-medium">
                    {employee.employeeNumber}
                  </p>
                </div>
              )}
              {employee.hireDate && (
                <div>
                  <Label>Date d&apos;embauche</Label>
                  <p className="mt-1 text-sm text-foreground font-medium">
                    {formatDate(employee.hireDate)}
                  </p>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Contrat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              {employee.contractType && (
                <div>
                  <Label>Type de contrat</Label>
                  <p className="mt-1 text-sm text-foreground font-medium">
                    {contractTypeLabels[employee.contractType] || employee.contractType}
                  </p>
                </div>
              )}
              {employee.contractStart && (
                <div>
                  <Label>Début du contrat</Label>
                  <p className="mt-1 text-sm text-foreground font-medium">
                    {formatDate(employee.contractStart)}
                  </p>
                </div>
              )}
              {employee.contractEnd && (
                <div>
                  <Label>Fin du contrat</Label>
                  <p className="mt-1 text-sm text-foreground font-medium">
                    {formatDate(employee.contractEnd)}
                  </p>
                </div>
              )}
              {employee.baseSalary && (
                <div>
                  <Label>Salaire de base</Label>
                  <p className="mt-1 text-sm text-foreground font-medium">
                    {formatCurrency(Number(employee.baseSalary))}
                  </p>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>
      </div>

      {employee.salaries && employee.salaries.length > 0 && (
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              Historique des Salaires ({employee.salaries.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/40">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Période
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Date de paiement
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Montant
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {employee.salaries.map((salary) => (
                    <tr key={salary.id} className="hover:bg-muted/20 transition-colors duration-150">
                      <td className="px-4 py-3 text-sm text-foreground">
                        {salary.month}/{salary.year}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        {salary.paidAt ? formatDate(salary.paidAt) : "Non payé"}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground font-semibold text-right">
                        {formatCurrency(Number(salary.amount))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {employee.bonuses && employee.bonuses.length > 0 && (
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Primes Récentes ({employee.bonuses.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {employee.bonuses.map((bonus) => (
                <div
                  key={bonus.id}
                  className="flex justify-between items-center p-3 bg-muted/50 dark:bg-muted/30 rounded-lg border border-border hover:bg-muted transition-colors duration-150"
                >
                  <div>
                    <p className="font-semibold text-sm text-foreground">{bonus.type}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {bonus.month}/{bonus.year}
                    </p>
                  </div>
                  <p className="font-semibold text-foreground">
                    {formatCurrency(Number(bonus.amount))}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {employee.leaves && employee.leaves.length > 0 && (
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Congés Récents ({employee.leaves.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {employee.leaves.map((leave) => (
                <div
                  key={leave.id}
                  className="flex justify-between items-center p-3 bg-muted/50 dark:bg-muted/30 rounded-lg border border-border hover:bg-muted transition-colors duration-150"
                >
                  <div>
                    <p className="font-semibold text-sm text-foreground">
                      {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{leave.type}</p>
                  </div>
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
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {employee.missionAssignments && employee.missionAssignments.length > 0 && (
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Missions ({employee.missionAssignments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {employee.missionAssignments.map((team) => (
                <Link
                  key={team.id}
                  href={`/dashboard/missions/${team.mission.id}`}
                  className="block p-3 bg-muted/50 dark:bg-muted/30 rounded-lg border border-border hover:bg-muted transition-colors duration-150"
                >
                  <p className="font-semibold text-sm text-foreground">
                    {team.mission.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatDate(team.mission.startDate)} -{" "}
                    {team.mission.endDate ? formatDate(team.mission.endDate) : "En cours"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Rôle: {team.role}</p>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {employee.evaluations && employee.evaluations.length > 0 && (
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Évaluations ({employee.evaluations.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {employee.evaluations.map((evaluation) => (
                <div
                  key={evaluation.id}
                  className="p-3 bg-muted/50 dark:bg-muted/30 rounded-lg border border-border hover:bg-muted transition-colors duration-150"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-sm text-foreground">
                        {evaluation.period} {evaluation.year}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDate(evaluation.createdAt)}
                      </p>
                    </div>
                    {evaluation.score && (
                      <p className="font-semibold text-lg text-foreground">
                        {evaluation.score}/10
                      </p>
                    )}
                  </div>
                  {evaluation.comments && (
                    <p className="text-sm text-foreground mt-2">{evaluation.comments}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

