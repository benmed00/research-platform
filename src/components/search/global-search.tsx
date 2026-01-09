/**
 * @file global-search.tsx
 * @description src/components/search/global-search.tsx
 * @author github-actions[bot]
 * @created 2026-01-04
 * @updated 2026-01-04
 * @updates 1
 * @lines 312
 * @size 11.82 KB
 */
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Search,
  X,
  Loader2,
  Database,
  MapPin,
  Package,
  Users,
  FileText,
  BookOpen,
  ChevronRight,
  DollarSign,
  TrendingUp,
  Droplets,
  Wind,
  Thermometer,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SearchResult {
  species: any[];
  missions: any[];
  equipment: any[];
  employees: any[];
  documents: any[];
  publications: any[];
  users: any[];
  expenses: any[];
  budgets: any[];
  waterQuality: any[];
  airQuality: any[];
  climateData: any[];
}

interface GlobalSearchProps {
  className?: string;
}

const typeIcons = {
  species: Database,
  missions: MapPin,
  equipment: Package,
  employees: Users,
  documents: FileText,
  publications: BookOpen,
  users: Users,
  expenses: DollarSign,
  budgets: TrendingUp,
  waterQuality: Droplets,
  airQuality: Wind,
  climateData: Thermometer,
};

const typeLabels = {
  species: "Espèces",
  missions: "Missions",
  equipment: "Équipements",
  employees: "Employés",
  documents: "Documents",
  publications: "Publications",
  users: "Utilisateurs",
  expenses: "Dépenses",
  budgets: "Budgets",
  waterQuality: "Qualité de l'eau",
  airQuality: "Qualité de l'air",
  climateData: "Données climatiques",
};

const typeRoutes = {
  species: "/dashboard/species",
  missions: "/dashboard/missions",
  equipment: "/dashboard/equipment",
  employees: "/dashboard/rh/employees",
  documents: "/dashboard/documents",
  publications: "/dashboard/publications",
  users: "/dashboard/users",
  expenses: "/dashboard/finance/expenses",
  budgets: "/dashboard/finance/budgets",
  waterQuality: "/dashboard/environment/water",
  airQuality: "/dashboard/environment/air",
  climateData: "/dashboard/environment/climate",
};

export function GlobalSearch({ className }: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const debouncedQuery = useDebounce(query, 300);

  // Search API call
  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults(null);
      setIsOpen(false);
      return;
    }

    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}&limit=5`)
      .then((res) => res.json())
      .then((data) => {
        setResults(data.results);
        setIsOpen(data.total > 0);
        setSelectedIndex(-1);
      })
      .catch((error) => {
        console.error("Search error:", error);
        setResults(null);
        setIsOpen(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [debouncedQuery]);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen || !results) return;

      const allResults = [
        ...results.species.map((r) => ({ type: "species" as const, item: r })),
        ...results.missions.map((r) => ({ type: "missions" as const, item: r })),
        ...results.equipment.map((r) => ({ type: "equipment" as const, item: r })),
        ...results.employees.map((r) => ({ type: "employees" as const, item: r })),
        ...results.documents.map((r) => ({ type: "documents" as const, item: r })),
        ...results.publications.map((r) => ({ type: "publications" as const, item: r })),
        ...results.users.map((r) => ({ type: "users" as const, item: r })),
        ...results.expenses.map((r) => ({ type: "expenses" as const, item: r })),
        ...results.budgets.map((r) => ({ type: "budgets" as const, item: r })),
        ...results.waterQuality.map((r) => ({ type: "waterQuality" as const, item: r })),
        ...results.airQuality.map((r) => ({ type: "airQuality" as const, item: r })),
        ...results.climateData.map((r) => ({ type: "climateData" as const, item: r })),
      ];

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < allResults.length - 1 ? prev + 1 : prev));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
      } else if (e.key === "Enter" && selectedIndex >= 0) {
        e.preventDefault();
        const selected = allResults[selectedIndex];
        router.push(`${typeRoutes[selected.type]}/${selected.item.id}`);
        setIsOpen(false);
        setQuery("");
      } else if (e.key === "Escape") {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    },
    [isOpen, results, selectedIndex, router]
  );

  const handleResultClick = (type: keyof typeof typeRoutes, id: string) => {
    router.push(`${typeRoutes[type]}/${id}`);
    setIsOpen(false);
    setQuery("");
    inputRef.current?.blur();
  };

  const handleViewAll = (type: keyof typeof typeRoutes) => {
    router.push(typeRoutes[type]);
    setIsOpen(false);
    setQuery("");
  };

  const totalResults = results
    ? results.species.length +
      results.missions.length +
      results.equipment.length +
      results.employees.length +
      results.documents.length +
      results.publications.length +
      results.users.length +
      results.expenses.length +
      results.budgets.length +
      results.waterQuality.length +
      results.airQuality.length +
      results.climateData.length
    : 0;

  return (
    <div ref={containerRef} className={cn("relative flex-1 max-w-md", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Rechercher dans toutes les données..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results && totalResults > 0) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          className="w-full pl-10 pr-10 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground placeholder:text-muted-foreground transition-colors duration-200 text-sm"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults(null);
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      {isOpen && results && totalResults > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-2 shadow-lg z-50 max-h-[600px] overflow-y-auto">
          <div className="p-2">
            {Object.entries(results).map(([type, items]) => {
              if (items.length === 0) return null;
              const Icon = typeIcons[type as keyof typeof typeIcons];
              const label = typeLabels[type as keyof typeof typeLabels];
              const route = typeRoutes[type as keyof typeof typeRoutes];

              return (
                <div key={type} className="mb-4 last:mb-0">
                  <div className="flex items-center justify-between px-3 py-2 mb-1">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-semibold text-foreground">{label}</span>
                      <span className="text-xs text-muted-foreground">({items.length})</span>
                    </div>
                    {items.length >= 5 && (
                      <button
                        onClick={() => handleViewAll(type as keyof typeof typeRoutes)}
                        className="text-xs text-primary hover:underline"
                      >
                        Voir tout
                      </button>
                    )}
                  </div>
                  <div className="space-y-1">
                    {items.map((item: any, idx: number) => {
                      const globalIndex = [
                        ...results.species,
                        ...results.missions,
                        ...results.equipment,
                        ...results.employees,
                        ...results.documents,
                        ...results.publications,
                        ...results.users,
                        ...results.expenses,
                        ...results.budgets,
                        ...results.waterQuality,
                        ...results.airQuality,
                        ...results.climateData,
                      ].findIndex((r) => r.id === item.id);
                      const isSelected = selectedIndex === globalIndex;

                      return (
                        <button
                          key={item.id}
                          onClick={() => handleResultClick(type as keyof typeof typeRoutes, item.id)}
                          className={cn(
                            "w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors flex items-center justify-between",
                            isSelected && "bg-muted"
                          )}
                        >
                          <div className="flex-1 min-w-0">
                            {type === "species" && (
                              <div>
                                <div className="font-medium text-sm truncate">{item.scientificName}</div>
                                {item.commonName && (
                                  <div className="text-xs text-muted-foreground truncate">{item.commonName}</div>
                                )}
                              </div>
                            )}
                            {type === "missions" && (
                              <div>
                                <div className="font-medium text-sm truncate">{item.title}</div>
                                {item.location && (
                                  <div className="text-xs text-muted-foreground truncate">{item.location}</div>
                                )}
                              </div>
                            )}
                            {type === "equipment" && (
                              <div>
                                <div className="font-medium text-sm truncate">{item.name}</div>
                                {item.serialNumber && (
                                  <div className="text-xs text-muted-foreground truncate">
                                    S/N: {item.serialNumber}
                                  </div>
                                )}
                              </div>
                            )}
                            {type === "employees" && (
                              <div>
                                <div className="font-medium text-sm truncate">
                                  {item.user?.firstName} {item.user?.lastName}
                                </div>
                                {item.user?.email && (
                                  <div className="text-xs text-muted-foreground truncate">{item.user.email}</div>
                                )}
                              </div>
                            )}
                            {type === "documents" && (
                              <div>
                                <div className="font-medium text-sm truncate">{item.title}</div>
                                {item.author && (
                                  <div className="text-xs text-muted-foreground truncate">
                                    {item.author.firstName} {item.author.lastName}
                                  </div>
                                )}
                              </div>
                            )}
                            {type === "publications" && (
                              <div>
                                <div className="font-medium text-sm truncate">{item.title}</div>
                                {item.year && (
                                  <div className="text-xs text-muted-foreground truncate">{item.year}</div>
                                )}
                              </div>
                            )}
                            {type === "users" && (
                              <div>
                                <div className="font-medium text-sm truncate">
                                  {item.firstName} {item.lastName}
                                </div>
                                {item.email && (
                                  <div className="text-xs text-muted-foreground truncate">{item.email}</div>
                                )}
                              </div>
                            )}
                            {type === "expenses" && (
                              <div>
                                <div className="font-medium text-sm truncate">{item.description}</div>
                                {item.category && (
                                  <div className="text-xs text-muted-foreground truncate">
                                    {item.category} - {item.amount ? `€${Number(item.amount).toFixed(2)}` : ""}
                                  </div>
                                )}
                              </div>
                            )}
                            {type === "budgets" && (
                              <div>
                                <div className="font-medium text-sm truncate">
                                  Budget {item.year}
                                </div>
                                {item.totalAmount && (
                                  <div className="text-xs text-muted-foreground truncate">
                                    €{Number(item.totalAmount).toFixed(2)}
                                  </div>
                                )}
                              </div>
                            )}
                            {type === "waterQuality" && (
                              <div>
                                <div className="font-medium text-sm truncate">{item.location}</div>
                                {item.type && (
                                  <div className="text-xs text-muted-foreground truncate">
                                    {item.type} - {item.date ? new Date(item.date).toLocaleDateString() : ""}
                                  </div>
                                )}
                              </div>
                            )}
                            {type === "airQuality" && (
                              <div>
                                <div className="font-medium text-sm truncate">{item.location}</div>
                                {item.date && (
                                  <div className="text-xs text-muted-foreground truncate">
                                    {new Date(item.date).toLocaleDateString()}
                                  </div>
                                )}
                              </div>
                            )}
                            {type === "climateData" && (
                              <div>
                                <div className="font-medium text-sm truncate">
                                  {item.stationId || item.location}
                                </div>
                                {item.date && (
                                  <div className="text-xs text-muted-foreground truncate">
                                    {new Date(item.date).toLocaleDateString()}
                                    {item.temperature && ` - ${item.temperature}°C`}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground ml-2 flex-shrink-0" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}

