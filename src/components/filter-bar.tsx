/**
 * @file filter-bar.tsx
 * @description src/components/filter-bar.tsx
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-04
 * @updates 3
 * @lines 96
 * @size 2.55 KB
 */
"use client";

import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterBarProps {
  filters: {
    label: string;
    key: string;
    options: FilterOption[];
  }[];
  activeFilters: Record<string, string>;
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
}

export function FilterBar({
  filters,
  activeFilters,
  onFilterChange,
  onClearFilters,
}: FilterBarProps) {
  const hasActiveFilters = Object.keys(activeFilters).length > 0;

  return (
    <div className="flex items-center gap-4 flex-wrap">
      <div className="flex items-center gap-2">
        <Filter className="w-5 h-5 text-gray-400" />
        <span className="text-sm font-medium text-gray-700">Filtres:</span>
      </div>

      {filters.map((filter) => (
        <div key={filter.key} className="flex items-center gap-2">
          <label className="text-sm text-gray-600">{filter.label}:</label>
          <select
            value={activeFilters[filter.key] || ""}
            onChange={(e) => onFilterChange(filter.key, e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Tous</option>
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      ))}

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="flex items-center gap-1"
        >
          <X className="w-4 h-4" />
          Effacer
        </Button>
      )}

      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          {Object.entries(activeFilters).map(([key, value]) => {
            const filter = filters.find((f) => f.key === key);
            const option = filter?.options.find((o) => o.value === value);
            if (!option) return null;
            return (
              <Badge key={key} variant="info">
                {filter?.label}: {option.label}
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}

