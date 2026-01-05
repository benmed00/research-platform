/**
 * @file equipment-filters.tsx
 * @description src/components/filters/equipment-filters.tsx
 * @author github-actions[bot]
 * @created 2026-01-04
 * @updated 2026-01-04
 * @updates 1
 * @lines 169
 * @size 5.31 KB
 */
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EquipmentFilters {
  search: string;
  category: string[];
  status: string[];
}

interface EquipmentFiltersProps {
  filters: EquipmentFilters;
  onFiltersChange: (filters: EquipmentFilters) => void;
  resultCount: number;
  className?: string;
}

const EQUIPMENT_CATEGORIES = [
  { value: "VEHICULE", label: "🚗 Véhicule" },
  { value: "BATEAU", label: "⛵ Bateau" },
  { value: "EQUIPEMENT_SCIENTIFIQUE", label: "🔬 Équipement Scientifique" },
  { value: "INFORMATIQUE", label: "💻 Informatique" },
  { value: "CAMPING_TERRAIN", label: "⛺ Camping & Terrain" },
  { value: "LABORATOIRE", label: "🧪 Laboratoire" },
];

const EQUIPMENT_STATUSES = [
  { value: "AVAILABLE", label: "✅ Disponible" },
  { value: "IN_USE", label: "🔧 En utilisation" },
  { value: "MAINTENANCE", label: "🔨 En maintenance" },
  { value: "RETIRED", label: "❌ Retiré" },
];

export function EquipmentFiltersPanel({
  filters,
  onFiltersChange,
  resultCount,
  className,
}: EquipmentFiltersProps) {
  const [isOpen, setIsOpen] = useState(true);

  const updateFilter = (key: keyof EquipmentFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const toggleArrayFilter = (key: "category" | "status", value: string) => {
    const currentArray = filters[key];
    const newArray = currentArray.includes(value)
      ? currentArray.filter((v) => v !== value)
      : [...currentArray, value];
    updateFilter(key, newArray);
  };

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      category: [],
      status: [],
    });
  };

  const hasActiveFilters =
    filters.search.length > 0 ||
    filters.category.length > 0 ||
    filters.status.length > 0;

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
              placeholder="Nom, numéro de série, localisation..."
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Catégorie</Label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {EQUIPMENT_CATEGORIES.map((category) => (
                <label
                  key={category.value}
                  className="flex items-center gap-2 p-2 rounded-md border cursor-pointer hover:bg-muted transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={filters.category.includes(category.value)}
                    onChange={() => toggleArrayFilter("category", category.value)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">{category.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>Statut</Label>
            <div className="grid grid-cols-2 gap-2">
              {EQUIPMENT_STATUSES.map((status) => (
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

