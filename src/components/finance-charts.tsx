/**
 * @file finance-charts.tsx
 * @description src/components/finance-charts.tsx
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-04
 * @updates 3
 * @lines 134
 * @size 3.89 KB
 */
"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface FinanceChartsProps {
  monthlyExpenses: Array<{ month: string; amount: number }>;
  expensesByCategory: Array<{ name: string; value: number }>;
  budgetData: Array<{ name: string; budget: number; spent: number }>;
}

const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];

export function FinanceCharts({
  monthlyExpenses,
  expensesByCategory,
  budgetData,
}: FinanceChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Graphique d'évolution des dépenses */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Évolution des Dépenses (6 derniers mois)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyExpenses}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              formatter={(value: number) => [
                new Intl.NumberFormat("fr-FR", {
                  style: "currency",
                  currency: "MAD",
                }).format(value),
                "Montant",
              ]}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#ef4444"
              strokeWidth={2}
              name="Dépenses"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Graphique de répartition par catégorie */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Répartition par Catégorie</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={expensesByCategory}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {expensesByCategory.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [
                new Intl.NumberFormat("fr-FR", {
                  style: "currency",
                  currency: "MAD",
                }).format(value),
                "Montant",
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Graphique Budget vs Dépenses */}
      {budgetData.length > 0 && (
        <div className="bg-white p-6 rounded-lg border lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Budget vs Dépenses par Catégorie</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={budgetData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => [
                  new Intl.NumberFormat("fr-FR", {
                    style: "currency",
                    currency: "MAD",
                  }).format(value),
                  "",
                ]}
              />
              <Legend />
              <Bar dataKey="budget" fill="#3b82f6" name="Budget" />
              <Bar dataKey="spent" fill="#ef4444" name="Dépensé" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

