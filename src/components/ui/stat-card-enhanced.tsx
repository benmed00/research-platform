/**
 * @file stat-card-enhanced.tsx
 * @description Enhanced stat card component with gradients and trends
 * @author 1
 * @created 2026-01-05
 * @updated 2026-01-05
 * @updates 1
 * @lines 120
 * @size 3.5 KB
 */
"use client";

import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Trend {
  value: number;
  direction: "up" | "down" | "neutral";
  period?: string;
}

interface StatCardEnhancedProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: Trend;
  gradient?: string;
  onClick?: () => void;
  className?: string;
  description?: string;
}

export function StatCardEnhanced({
  title,
  value,
  icon: Icon,
  trend,
  gradient = "from-blue-500 to-cyan-500",
  onClick,
  className,
  description,
}: StatCardEnhancedProps) {
  const TrendIcon = trend?.direction === "up" 
    ? TrendingUp 
    : trend?.direction === "down" 
    ? TrendingDown 
    : Minus;

  const trendColor = trend?.direction === "up"
    ? "text-green-600 dark:text-green-400"
    : trend?.direction === "down"
    ? "text-red-600 dark:text-red-400"
    : "text-gray-600 dark:text-gray-400";

  return (
    <Card
      className={cn(
        "p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group",
        onClick && "hover:scale-[1.02]",
        className
      )}
      onClick={onClick}
      variant="elevated"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            {value}
          </p>
          {description && (
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {description}
            </p>
          )}
        </div>
        <div
          className={cn(
            "p-3 rounded-xl flex-shrink-0 ml-4 shadow-sm",
            `bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-20 transition-opacity`
          )}
        >
          <div className={cn("text-gray-900 dark:text-gray-100", `text-${gradient.split('-')[1]}-600`)}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </div>

      {trend && (
        <div className={cn("flex items-center gap-1 text-sm font-medium", trendColor)}>
          <TrendIcon className="w-4 h-4" />
          <span>{Math.abs(trend.value)}%</span>
          {trend.period && (
            <span className="text-gray-500 dark:text-gray-500 text-xs ml-1">
              {trend.period}
            </span>
          )}
        </div>
      )}

      {/* Mini sparkline placeholder - can be replaced with actual chart */}
      <div className="mt-4 h-12 w-full bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent rounded opacity-50">
        {/* Sparkline chart would go here */}
      </div>
    </Card>
  );
}
