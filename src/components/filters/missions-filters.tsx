"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MissionsFilters {
  search: string;
  status: string[];
  dateFrom: string;
  dateTo: string;
}

interface MissionsFiltersProps {
  filters: MissionsFilters;
  onFiltersChange: (filters: MissionsFilters) => void;
  resultCount: number;
  className?: string;
}

const MISSION_STATUSES = [
  { value: "planned", label: "📅 Planifiée" },
  { value: "in_progress", label: "⟳ En cours" },
  { value: "completed", label: "✓ Terminée" },
  { value: "cancelled", label: "✗ Annulée" },
];

export function MissionsFiltersPanel({
  filters,
  onFiltersChange,
  resultCount,
  className,
}: MissionsFiltersProps) {
  const [isOpen, setIsOpen] = useState(true);

  const updateFilter = (key: keyof MissionsFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const toggleArrayFilter = (key: "status", value: string) => {
    const currentArray = filters[key];
    const newArray = currentArray.includes(value)
      ? currentArray.filter((v) => v !== value)
      : [...currentArray, value];
    updateFilter(key, newArray);
  };

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      status: [],
      dateFrom: "",
      dateTo: "",
    });
  };

  const hasActiveFilters =
    filters.search.length > 0 ||
    filters.status.length > 0 ||
    filters.dateFrom.length > 0 ||
    filters.dateTo.length > 0;

  return (
    <Card variant="elevated" className={cn("p-4", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-muted-foreground" />
          <h3 className="font-semibold text-foreground">Filtres</h3>
          {hasActiveFilters && (
            <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
              Actifs
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="h-8 w-8"
        >
          {isOpen ? "−" : "+"}
        </Button>
      </div>

      {isOpen && (
        <div className="space-y-4">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Recherche</Label>
            <Input
              id="search"
              placeholder="Titre, description, localisation..."
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>Statut</Label>
            <div className="grid grid-cols-2 gap-2">
              {MISSION_STATUSES.map((status) => (
                <label
                  key={status.value}
                  className="flex items-center gap-2 p-2 rounded-md border cursor-pointer hover:bg-muted transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={filters.status.includes(status.value)}
                    onChange={() => toggleArrayFilter("status", status.value)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">{status.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <Label>Période</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="dateFrom" className="text-xs text-muted-foreground">
                  Du
                </Label>
                <Input
                  id="dateFrom"
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => updateFilter("dateFrom", e.target.value)}
                  className="text-sm"
                />
              </div>
              <div>
                <Label htmlFor="dateTo" className="text-xs text-muted-foreground">
                  Au
                </Label>
                <Input
                  id="dateTo"
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => updateFilter("dateTo", e.target.value)}
                  className="text-sm"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t">
            <Button variant="outline" onClick={clearFilters} size="sm" disabled={!hasActiveFilters}>
              <X className="w-4 h-4 mr-2" />
              Effacer
            </Button>
            <div className="text-sm text-muted-foreground">
              {resultCount} résultat{resultCount !== 1 ? "s" : ""}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

