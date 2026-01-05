/**
 * @file species-filters.tsx
 * @description src/components/filters/species-filters.tsx
 * @author github-actions[bot]
 * @created 2026-01-04
 * @updated 2026-01-04
 * @updates 1
 * @lines 186
 * @size 5.83 KB
 */
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SpeciesFilters {
  search: string;
  type: string[];
  iucnStatus: string[];
  habitat: string;
}

interface SpeciesFiltersProps {
  filters: SpeciesFilters;
  onFiltersChange: (filters: SpeciesFilters) => void;
  resultCount: number;
  className?: string;
}

const SPECIES_TYPES = [
  { value: "FLORE_TERRESTRE", label: "🌿 Flore Terrestre" },
  { value: "FAUNE_TERRESTRE", label: "🦌 Faune Terrestre" },
  { value: "FAUNE_MARINE", label: "🐠 Faune Marine" },
  { value: "ESPECE_EAU_DOUCE", label: "🐟 Espèce Eau Douce" },
];

const IUCN_STATUSES = [
  { value: "LC", label: "LC - Préoccupation mineure" },
  { value: "NT", label: "NT - Quasi menacé" },
  { value: "VU", label: "VU - Vulnérable" },
  { value: "EN", label: "EN - En danger" },
  { value: "CR", label: "CR - En danger critique" },
  { value: "EW", label: "EW - Éteint à l'état sauvage" },
  { value: "EX", label: "EX - Éteint" },
  { value: "DD", label: "DD - Données insuffisantes" },
  { value: "NE", label: "NE - Non évalué" },
];

export function SpeciesFiltersPanel({
  filters,
  onFiltersChange,
  resultCount,
  className,
}: SpeciesFiltersProps) {
  const [isOpen, setIsOpen] = useState(true);

  const updateFilter = (key: keyof SpeciesFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const toggleArrayFilter = (key: "type" | "iucnStatus", value: string) => {
    const currentArray = filters[key];
    const newArray = currentArray.includes(value)
      ? currentArray.filter((v) => v !== value)
      : [...currentArray, value];
    updateFilter(key, newArray);
  };

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      type: [],
      iucnStatus: [],
      habitat: "",
    });
  };

  const hasActiveFilters =
    filters.search.length > 0 ||
    filters.type.length > 0 ||
    filters.iucnStatus.length > 0 ||
    filters.habitat.length > 0;

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
              placeholder="Nom scientifique, commun, habitat..."
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
            />
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label>Type d&apos;espèce</Label>
            <div className="grid grid-cols-2 gap-2">
              {SPECIES_TYPES.map((type) => (
                <label
                  key={type.value}
                  className="flex items-center gap-2 p-2 rounded-md border cursor-pointer hover:bg-muted transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={filters.type.includes(type.value)}
                    onChange={() => toggleArrayFilter("type", type.value)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* IUCN Status */}
          <div className="space-y-2">
            <Label>Statut IUCN</Label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {IUCN_STATUSES.map((status) => (
                <label
                  key={status.value}
                  className="flex items-center gap-2 p-2 rounded-md border cursor-pointer hover:bg-muted transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={filters.iucnStatus.includes(status.value)}
                    onChange={() => toggleArrayFilter("iucnStatus", status.value)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">{status.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Habitat */}
          <div className="space-y-2">
            <Label htmlFor="habitat">Habitat</Label>
            <Input
              id="habitat"
              placeholder="Rechercher par habitat..."
              value={filters.habitat}
              onChange={(e) => updateFilter("habitat", e.target.value)}
            />
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

