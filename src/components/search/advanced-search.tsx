/**
 * @file advanced-search.tsx
 * @description src/components/search/advanced-search.tsx
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-01
 * @updates 1
 * @lines 236
 * @size 8.07 KB
 */
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Search, X } from "lucide-react";

interface SearchFilter {
  query?: string;
  type?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  category?: string;
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilter) => void;
  onReset: () => void;
  entityType: "missions" | "species" | "equipment" | "documents" | "expenses" | "employees" | "publications";
}

export function AdvancedSearch({ onSearch, onReset, entityType }: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilter>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleReset = () => {
    setFilters({});
    onReset();
  };

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recherche
            </label>
            <Input
              placeholder="Rechercher..."
              value={filters.query || ""}
              onChange={(e) => setFilters({ ...filters, query: e.target.value })}
            />
          </div>

          {entityType === "missions" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Statut
                </label>
                <Select
                  value={filters.status || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value || undefined })
                  }
                >
                  <option value="">Tous</option>
                  <option value="PLANNED">Planifiée</option>
                  <option value="IN_PROGRESS">En cours</option>
                  <option value="COMPLETED">Terminée</option>
                  <option value="CANCELLED">Annulée</option>
                </Select>
              </div>
            </>
          )}

          {entityType === "species" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <Select
                value={filters.type || ""}
                onChange={(e) =>
                  setFilters({ ...filters, type: e.target.value || undefined })
                }
              >
                <option value="">Tous</option>
                <option value="FLORE_TERRESTRE">Flore terrestre</option>
                <option value="FAUNE_TERRESTRE">Faune terrestre</option>
                <option value="FAUNE_MARINE">Faune marine</option>
                <option value="ESPECE_EAU_DOUCE">Eau douce</option>
              </Select>
            </div>
          )}

          {entityType === "expenses" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie
              </label>
              <Input
                value={filters.category || ""}
                onChange={(e) =>
                  setFilters({ ...filters, category: e.target.value || undefined })
                }
                placeholder="Catégorie..."
              />
            </div>
          )}

          {entityType === "equipment" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie
              </label>
              <Select
                value={filters.category || ""}
                onChange={(e) =>
                  setFilters({ ...filters, category: e.target.value || undefined })
                }
              >
                <option value="">Toutes</option>
                <option value="VEHICULE">Véhicule</option>
                <option value="BATEAU">Bateau</option>
                <option value="EQUIPEMENT_SCIENTIFIQUE">Équipement Scientifique</option>
                <option value="INFORMATIQUE">Informatique</option>
                <option value="CAMPING_TERRAIN">Camping & Terrain</option>
                <option value="LABORATOIRE">Laboratoire</option>
              </Select>
            </div>
          )}

          {entityType === "equipment" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Statut
              </label>
              <Select
                value={filters.status || ""}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value || undefined })
                }
              >
                <option value="">Tous</option>
                <option value="AVAILABLE">Disponible</option>
                <option value="IN_USE">En utilisation</option>
                <option value="MAINTENANCE">En maintenance</option>
                <option value="RETIRED">Retiré</option>
              </Select>
            </div>
          )}

          {entityType === "documents" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <Select
                value={filters.type || ""}
                onChange={(e) =>
                  setFilters({ ...filters, type: e.target.value || undefined })
                }
              >
                <option value="">Tous</option>
                <option value="RAPPORT_SCIENTIFIQUE">Rapport Scientifique</option>
                <option value="RAPPORT_ADMINISTRATIF">Rapport Administratif</option>
                <option value="DONNEE_BRUTE">Donnée Brute</option>
                <option value="PUBLICATION">Publication</option>
                <option value="AUTRE">Autre</option>
              </Select>
            </div>
          )}

          {entityType === "publications" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <Select
                value={filters.type || ""}
                onChange={(e) =>
                  setFilters({ ...filters, type: e.target.value || undefined })
                }
              >
                <option value="">Tous</option>
                <option value="LIVRE_ANNUEL">Livre Annuel</option>
                <option value="ARTICLE">Article</option>
                <option value="RAPPORT">Rapport</option>
                <option value="AUTRE">Autre</option>
              </Select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date début
            </label>
            <Input
              type="date"
              value={filters.dateFrom || ""}
              onChange={(e) =>
                setFilters({ ...filters, dateFrom: e.target.value || undefined })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date fin
            </label>
            <Input
              type="date"
              value={filters.dateTo || ""}
              onChange={(e) =>
                setFilters({ ...filters, dateTo: e.target.value || undefined })
              }
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button type="submit">
            <Search className="w-4 h-4 mr-2" />
            Rechercher
          </Button>
          <Button type="button" variant="outline" onClick={handleReset}>
            <X className="w-4 h-4 mr-2" />
            Réinitialiser
          </Button>
        </div>
      </form>
    </Card>
  );
}


