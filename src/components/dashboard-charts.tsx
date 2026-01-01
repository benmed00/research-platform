/**
 * @file dashboard-charts.tsx
 * @description src/components/dashboard-charts.tsx
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-01
 * @updates 2
 * @lines 212
 * @size 7.27 KB
 */
"use client";

import { useMemo, memo, useState, useEffect } from "react";
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
import { Card } from "@/components/ui/card";

interface DashboardChartsProps {
  missionsByMonth: Array<{ month: string; count: number }>;
  speciesByType: Array<{ name: string; value: number }>;
  equipmentByStatus: Array<{ name: string; value: number }>;
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

function DashboardChartsComponent({
  missionsByMonth,
  speciesByType,
  equipmentByStatus,
}: DashboardChartsProps) {
  const [isMounted, setIsMounted] = useState(false);

  // Delay chart rendering to avoid blocking initial render
  useEffect(() => {
    // Use requestAnimationFrame to delay after initial render
    const timer = requestAnimationFrame(() => {
      setIsMounted(true);
    });
    return () => cancelAnimationFrame(timer);
  }, []);

  // Memoize pie chart cells to prevent re-renders
  const pieCells = useMemo(
    () => speciesByType.map((entry, index) => (
      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
    )),
    [speciesByType]
  );

  // Show placeholder during initial mount to prevent layout shift
  if (!isMounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6" variant="elevated">
          <h3 className="text-xl font-semibold mb-4 text-foreground">Missions par mois</h3>
          <div className="h-[280px] flex items-center justify-center text-muted-foreground">
            Chargement...
          </div>
        </Card>
        <Card className="p-6" variant="elevated">
          <h3 className="text-xl font-semibold mb-4 text-foreground">Répartition des espèces</h3>
          <div className="h-[280px] flex items-center justify-center text-muted-foreground">
            Chargement...
          </div>
        </Card>
        <Card className="p-6 lg:col-span-2" variant="elevated">
          <h3 className="text-xl font-semibold mb-4 text-foreground">Équipements par statut</h3>
          <div className="h-[280px] flex items-center justify-center text-muted-foreground">
            Chargement...
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Graphique des missions par mois */}
      <Card className="p-6" variant="elevated">
        <h3 className="text-xl font-semibold mb-4 text-foreground">Missions par mois</h3>
        <div style={{ width: '100%', height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
          <LineChart data={missionsByMonth}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
            <XAxis 
              dataKey="month" 
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.5rem',
                padding: '0.5rem',
                color: 'hsl(var(--foreground))'
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              itemStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Line
              type="monotone"
              dataKey="count"
              stroke="hsl(var(--primary))"
              strokeWidth={2.5}
              name="Nombre de missions"
              dot={{ fill: 'hsl(var(--primary))', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Graphique des espèces par type */}
      <Card className="p-6" variant="elevated">
        <h3 className="text-xl font-semibold mb-4 text-foreground">Répartition des espèces</h3>
        <div style={{ width: '100%', height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={speciesByType}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={90}
              fill="#8884d8"
              dataKey="value"
            >
              {pieCells}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.5rem',
                padding: '0.5rem',
                color: 'hsl(var(--foreground))'
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              itemStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
          </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Graphique des équipements par statut */}
      <Card className="p-6 lg:col-span-2" variant="elevated">
        <h3 className="text-xl font-semibold mb-4 text-foreground">Équipements par statut</h3>
        <div style={{ width: '100%', height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
          <BarChart data={equipmentByStatus}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
            <XAxis 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.5rem',
                padding: '0.5rem',
                color: 'hsl(var(--foreground))'
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              itemStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Bar 
              dataKey="value" 
              fill="hsl(var(--primary))" 
              name="Nombre d'équipements"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

export const DashboardCharts = memo(DashboardChartsComponent);

