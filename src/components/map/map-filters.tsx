/**
 * @file map-filters.tsx
 * @description Component for filtering map data (species, missions, etc.)
 */
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, X, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface MapFilters {
  search: string;
  speciesType: string[];
  iucnStatus: string[];
  missionStatus: string[];
  waterType: string[];
}

interface MapFiltersProps {
  filters: MapFilters;
  onFiltersChange: (filters: MapFilters) => void;
  speciesCount: number;
  missionsCount: number;
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
];

const MISSION_STATUSES = [
  { value: "planned", label: "📅 Planifiée" },
  { value: "in_progress", label: "⟳ En cours" },
  { value: "completed", label: "✓ Terminée" },
  { value: "cancelled", label: "✗ Annulée" },
];

const WATER_TYPES = [
  { value: "MER", label: "🌊 Mer" },
  { value: "SOURCE", label: "💧 Source" },
  { value: "BARRAGE", label: "🏔️ Barrage" },
];

export function MapFiltersPanel({ filters, onFiltersChange, speciesCount, missionsCount }: MapFiltersProps) {
  const [isOpen, setIsOpen] = useState(true);

  const updateFilter = (key: keyof MapFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const toggleArrayFilter = (key: keyof MapFilters, value: string) => {
    const currentArray = filters[key] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter((v) => v !== value)
      : [...currentArray, value];
    updateFilter(key, newArray);
  };

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      speciesType: [],
      iucnStatus: [],
      missionStatus: [],
      waterType: [],
    });
  };

  const hasActiveFilters =
    filters.search ||
    filters.speciesType.length > 0 ||
    filters.iucnStatus.length > 0 ||
    filters.missionStatus.length > 0 ||
    filters.waterType.length > 0;

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          <h3 className="font-semibold text-lg">Filtres</h3>
          {hasActiveFilters && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              Actifs
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="h-8 w-8 p-0"
        >
          {isOpen ? "−" : "+"}
        </Button>
      </div>

      {isOpen && (
        <>
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Recherche</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="search"
                placeholder="Nom scientifique, commun, localisation..."
                value={filters.search}
                onChange={(e) => updateFilter("search", e.target.value)}
                className="pl-10"
              />
              {filters.search && (
                <button
                  onClick={() => updateFilter("search", "")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Species Type Filter */}
          <div className="space-y-2">
            <Label>Type d&apos;espèce</Label>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {SPECIES_TYPES.map((type) => (
                <label
                  key={type.value}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded"
                >
                  <input
                    type="checkbox"
                    checked={filters.speciesType.includes(type.value)}
                    onChange={() => toggleArrayFilter("speciesType", type.value)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* IUCN Status Filter */}
          <div className="space-y-2">
            <Label>Statut IUCN</Label>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {IUCN_STATUSES.map((status) => (
                <label
                  key={status.value}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded"
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

          {/* Mission Status Filter */}
          <div className="space-y-2">
            <Label>Statut de mission</Label>
            <div className="space-y-1">
              {MISSION_STATUSES.map((status) => (
                <label
                  key={status.value}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded"
                >
                  <input
                    type="checkbox"
                    checked={filters.missionStatus.includes(status.value)}
                    onChange={() => toggleArrayFilter("missionStatus", status.value)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">{status.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Water Type Filter */}
          <div className="space-y-2">
            <Label>Type d&apos;eau</Label>
            <div className="space-y-1">
              {WATER_TYPES.map((type) => (
                <label
                  key={type.value}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded"
                >
                  <input
                    type="checkbox"
                    checked={filters.waterType.includes(type.value)}
                    onChange={() => toggleArrayFilter("waterType", type.value)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="pt-2 border-t space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <div>Espèces visibles: <strong>{speciesCount}</strong></div>
            <div>Missions visibles: <strong>{missionsCount}</strong></div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="w-full"
            >
              <X className="w-4 h-4 mr-2" />
              Effacer tous les filtres
            </Button>
          )}
        </>
      )}
    </Card>
  );
}

