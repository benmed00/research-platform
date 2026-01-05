/**
 * @file page.tsx
 * @description src/app/dashboard/finance/page.tsx
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-04
 * @updates 3
 * @lines 355
 * @size 12.43 KB
 */
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, DollarSign, TrendingUp, FileText } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { FinanceCharts } from "@/components/finance-charts";
import { ExportButtons } from "@/components/export/export-buttons";

// Force dynamic rendering to avoid build-time database queries
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function FinancePage() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  // Calculer la date de début pour les 6 derniers mois
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  sixMonthsAgo.setDate(1);

  const [budget, expenses, grants, invoices, allExpenses, allExpensesForCharts] =
    await Promise.all([
      prisma.budget.findFirst({
        where: { year: currentYear },
        include: {
          allocations: true,
        },
      }),
      prisma.expense.findMany({
        where: {
          date: {
            gte: new Date(currentYear, currentMonth - 1, 1),
            lt: new Date(currentYear, currentMonth, 1),
          },
        },
        take: 10,
        orderBy: { date: "desc" },
      }),
      prisma.grant.findMany({
        where: {
          status: "active",
        },
        orderBy: { startDate: "desc" },
      }),
      prisma.invoice.findMany({
        where: {
          status: "pending",
        },
        take: 10,
        orderBy: { dueDate: "asc" },
        include: {
          supplier: true,
        },
      }),
      prisma.expense.findMany({
        where: {
          date: {
            gte: new Date(currentYear, currentMonth - 1, 1),
            lt: new Date(currentYear, currentMonth, 1),
          },
        },
        orderBy: { date: "desc" },
      }),
      prisma.expense.findMany({
        where: {
          date: {
            gte: sixMonthsAgo,
          },
        },
        orderBy: { date: "asc" },
      }),
    ]);

  const totalExpenses = expenses.reduce(
    (sum, exp) => sum + Number(exp.amount),
    0
  );
  const totalGrants = grants.reduce(
    (sum, grant) => sum + Number(grant.amount),
    0
  );
  const totalPendingInvoices = invoices.reduce(
    (sum, inv) => sum + Number(inv.amount),
    0
  );

  // Préparer les données pour les graphiques
  // 1. Dépenses par mois (6 derniers mois)
  const monthlyExpensesMap = new Map<string, number>();
  const monthNames = [
    "Jan",
    "Fév",
    "Mar",
    "Avr",
    "Mai",
    "Jun",
    "Jul",
    "Aoû",
    "Sep",
    "Oct",
    "Nov",
    "Déc",
  ];

  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    monthlyExpensesMap.set(monthKey, 0);
  }

  allExpensesForCharts.forEach((expense) => {
    const date = new Date(expense.date);
    const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    const current = monthlyExpensesMap.get(monthKey) || 0;
    monthlyExpensesMap.set(monthKey, current + Number(expense.amount));
  });

  const monthlyExpenses = Array.from(monthlyExpensesMap.entries()).map(([month, amount]) => ({
    month,
    amount,
  }));

  // 2. Dépenses par catégorie
  const categoryMap = new Map<string, number>();
  allExpenses.forEach((expense) => {
    const category = expense.category || "Autre";
    const current = categoryMap.get(category) || 0;
    categoryMap.set(category, current + Number(expense.amount));
  });

  const expensesByCategory = Array.from(categoryMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // 3. Budget vs Dépenses par catégorie
  const budgetData: Array<{ name: string; budget: number; spent: number }> = [];
  if (budget && budget.allocations) {
    budget.allocations.forEach((allocation) => {
      const spent = allExpenses
        .filter((exp) => exp.category === allocation.category)
        .reduce((sum, exp) => sum + Number(exp.amount), 0);
      budgetData.push({
        name: allocation.category || "Autre",
        budget: Number(allocation.amount),
        spent,
      });
    });
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            Comptabilité & Finances
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400 mt-1.5">
            Gestion des budgets, dépenses et factures
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ExportButtons type="expenses" />
          <div className="flex gap-2">
            <Link href="/dashboard/finance/budgets/new">
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Budget
              </Button>
            </Link>
            <Link href="/dashboard/finance/expenses/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Dépense
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 hover:shadow-md transition-shadow duration-200" variant="elevated">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Budget {currentYear}
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                {budget ? formatCurrency(Number(budget.totalAmount)) : "N/A"}
              </p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-3 rounded-xl flex-shrink-0 ml-4 shadow-sm">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow duration-200" variant="elevated">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Dépenses ce mois
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                {formatCurrency(totalExpenses)}
              </p>
            </div>
            <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-xl flex-shrink-0 ml-4 shadow-sm">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow duration-200" variant="elevated">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Subventions actives
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                {formatCurrency(totalGrants)}
              </p>
            </div>
            <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-3 rounded-xl flex-shrink-0 ml-4 shadow-sm">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow duration-200" variant="elevated">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Factures en attente
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                {formatCurrency(totalPendingInvoices)}
              </p>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 p-3 rounded-xl flex-shrink-0 ml-4 shadow-sm">
              <FileText className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* Graphiques */}
      <FinanceCharts
        monthlyExpenses={monthlyExpenses}
        expensesByCategory={expensesByCategory}
        budgetData={budgetData}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="elevated" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Dépenses récentes
            </h2>
            <Link href="/dashboard/finance/expenses">
              <Button variant="ghost" size="sm">
                Voir tout
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {expenses.length > 0 ? (
              expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {expense.description}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                      {expense.category} •{" "}
                      {new Date(expense.date).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <p className="font-semibold text-red-600 dark:text-red-400 ml-4 flex-shrink-0">
                    {formatCurrency(Number(expense.amount))}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Aucune dépense ce mois
                </p>
              </div>
            )}
          </div>
        </Card>

        <Card variant="elevated" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Factures en attente
            </h2>
            <Link href="/dashboard/finance/invoices">
              <Button variant="ghost" size="sm">
                Voir tout
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {invoices.length > 0 ? (
              invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {invoice.supplier?.name || "Fournisseur"}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                      {invoice.number} • Échéance:{" "}
                      {new Date(invoice.dueDate).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <p className="font-semibold text-yellow-600 dark:text-yellow-400 ml-4 flex-shrink-0">
                    {formatCurrency(Number(invoice.amount))}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Aucune facture en attente
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

