/**
 * @file page.tsx
 * @description src/app/dashboard/maps/page.tsx
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-04
 * @updates 3
 * @lines 321
 * @size 12.08 KB
 */
"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Layers, Upload, Download, FileJson, FileSpreadsheet } from "lucide-react";
import { useState, useEffect, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import { MapFiltersPanel, MapFilters } from "@/components/map/map-filters";
import { MapCharts } from "@/components/map/map-charts";
import { exportToGeoJSON, exportToCSV, downloadFile } from "@/lib/map-export";
import { useNotifications } from "@/components/notifications/notification-provider";

// Dynamically import LeafletMap to avoid SSR issues
const LeafletMap = dynamic(() => import("@/components/map/leaflet-map"), {
  ssr: false,
});

export default function MapsPage() {
  const [selectedLayers, setSelectedLayers] = useState<Set<string>>(new Set(["missions"]));
  const [mapData, setMapData] = useState<any>({
    missions: [],
    species: [],
    waterQuality: [],
    climateStations: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<MapFilters>({
    search: "",
    speciesType: [],
    iucnStatus: [],
    missionStatus: [],
    waterType: [],
  });
  const { success, error: notifyError } = useNotifications();

  useEffect(() => {
    async function fetchMapData() {
      setLoading(true);
      setError(null);
      try {
        // Use optimized endpoint that fetches all species with locations and photos in one call
        const [missionsRes, speciesRes, waterRes, climateRes] = await Promise.all([
          fetch("/api/missions"),
          fetch("/api/species/with-locations"), // Optimized endpoint
          fetch("/api/water-quality"),
          fetch("/api/climate-data"),
        ]);

        // Handle different response formats
        const missionsData = missionsRes.ok ? await missionsRes.json() : [];
        const speciesWithLocations = speciesRes.ok ? await speciesRes.json() : [];
        const waterData = waterRes.ok ? await waterRes.json() : [];
        const climateData = climateRes.ok ? await climateRes.json() : [];

        // Normalize data (some APIs return arrays, others return { data: [] })
        const missions = Array.isArray(missionsData) ? missionsData : missionsData.data || [];
        const water = Array.isArray(waterData) ? waterData : waterData.data || [];
        const climate = Array.isArray(climateData) ? climateData : climateData.data || [];

        setMapData({
          missions: missions
            .filter((m: any) => m.latitude && m.longitude)
            .map((m: any) => ({
              id: m.id,
              title: m.title,
              description: m.description,
              location: m.location,
              latitude: m.latitude,
              longitude: m.longitude,
              startDate: m.startDate,
              endDate: m.endDate,
              status: m.status,
              objectives: m.objectives,
            })),
          species: speciesWithLocations,
          waterQuality: water
            .filter((w: any) => w.latitude && w.longitude)
            .map((w: any) => ({
              id: w.id,
              location: w.location,
              latitude: w.latitude,
              longitude: w.longitude,
              type: w.type,
              date: w.date,
              ph: w.ph,
              temperature: w.temperature,
              salinity: w.salinity,
            })),
          climateStations: climate
            .filter((c: any) => c.latitude && c.longitude)
            .map((c: any) => ({
              id: c.id,
              location: c.location,
              latitude: c.latitude,
              longitude: c.longitude,
              date: c.date,
            })),
        });
        // Don't show success notification on initial load (too noisy)
      } catch (error) {
        console.error("Error fetching map data:", error);
        const errorMessage = "Erreur lors du chargement des données de la carte";
        setError(errorMessage);
        notifyError("Erreur de chargement", errorMessage);
      } finally {
        setLoading(false);
      }
    }
    fetchMapData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const layers = useMemo(() => [
    { id: "missions", name: "Missions", color: "blue" },
    { id: "species", name: "Espèces", color: "green" },
    { id: "waterQuality", name: "Points d'eau", color: "blue" },
    { id: "climateStations", name: "Stations météo", color: "red" },
  ], []);

  const toggleLayer = useCallback((layerId: string) => {
    setSelectedLayers((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(layerId)) {
        newSelected.delete(layerId);
      } else {
        newSelected.add(layerId);
      }
      return newSelected;
    });
  }, []);

  const filteredData = useMemo(() => {
    let missions = selectedLayers.has("missions") ? mapData.missions : [];
    let species = selectedLayers.has("species") ? mapData.species : [];
    let waterQuality = selectedLayers.has("waterQuality") ? mapData.waterQuality : [];
    
    // Apply filters
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      missions = missions.filter((m: any) => 
        m.title?.toLowerCase().includes(searchLower) ||
        m.location?.toLowerCase().includes(searchLower) ||
        m.description?.toLowerCase().includes(searchLower)
      );
      species = species.filter((s: any) =>
        s.scientificName?.toLowerCase().includes(searchLower) ||
        s.commonName?.toLowerCase().includes(searchLower) ||
        s.location?.toLowerCase().includes(searchLower) ||
        s.habitat?.toLowerCase().includes(searchLower)
      );
      waterQuality = waterQuality.filter((w: any) =>
        w.location?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.speciesType.length > 0) {
      species = species.filter((s: any) => 
        s.type && filters.speciesType.includes(s.type)
      );
    }

    if (filters.iucnStatus.length > 0) {
      species = species.filter((s: any) => 
        s.iucnStatus && filters.iucnStatus.includes(s.iucnStatus)
      );
    }

    if (filters.missionStatus.length > 0) {
      missions = missions.filter((m: any) => 
        m.status && filters.missionStatus.includes(m.status)
      );
    }

    if (filters.waterType.length > 0) {
      waterQuality = waterQuality.filter((w: any) => 
        w.type && filters.waterType.includes(w.type)
      );
    }

    return {
      missions,
      species,
      waterQuality,
      climateStations: selectedLayers.has("climateStations") ? mapData.climateStations : [],
    };
  }, [selectedLayers, mapData, filters]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            SIG & Cartographie - Région du Rif
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400 mt-1.5">
            Visualisation géographique des données de recherche dans les montagnes du Rif (Nord du Maroc)
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              try {
                const geoJSON = exportToGeoJSON(filteredData);
                const filename = `carte-rif-${new Date().toISOString().split("T")[0]}.geojson`;
                downloadFile(geoJSON, filename, "application/geo+json");
                success("Export GeoJSON réussi", `Le fichier ${filename} a été téléchargé`);
              } catch (err) {
                notifyError("Erreur d'export", "Une erreur s'est produite lors de l'export GeoJSON");
              }
            }}
          >
            <FileJson className="w-4 h-4 mr-2" />
            Exporter GeoJSON
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              try {
                const csv = exportToCSV(filteredData);
                const filename = `carte-rif-${new Date().toISOString().split("T")[0]}.csv`;
                downloadFile(csv, filename, "text/csv");
                success("Export CSV réussi", `Le fichier ${filename} a été téléchargé`);
              } catch (err) {
                notifyError("Erreur d'export", "Une erreur s'est produite lors de l'export CSV");
              }
            }}
          >
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Exporter CSV
          </Button>
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Importer GeoJSON
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card variant="elevated" className="p-6">
            <h2 className="text-lg font-semibold mb-6 text-gray-900 dark:text-gray-100">
              Couches
            </h2>
            <div className="space-y-2">
              {layers.map((layer) => (
                <button
                  key={layer.id}
                  onClick={() => toggleLayer(layer.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 ${
                    selectedLayers.has(layer.id)
                      ? "bg-blue-100 dark:bg-blue-900/50 text-blue-900 dark:text-blue-100 shadow-sm border border-blue-200 dark:border-blue-800"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 flex-shrink-0" />
                    <span className="font-medium">{layer.name}</span>
                    <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                      ({layer.id === "missions" && mapData.missions.length}
                      {layer.id === "species" && mapData.species.length}
                      {layer.id === "waterQuality" && mapData.waterQuality.length}
                      {layer.id === "climateStations" && mapData.climateStations.length})
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          <MapFiltersPanel
            filters={filters}
            onFiltersChange={setFilters}
            speciesCount={filteredData.species.length}
            missionsCount={filteredData.missions.length}
          />
        </div>

        <Card variant="elevated" className="lg:col-span-3 p-6">
          <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm relative" style={{ height: "600px" }}>
            {loading && (
              <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 z-50 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">Chargement des données de la carte...</p>
                </div>
              </div>
            )}
            {error && (
              <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 z-50 flex items-center justify-center">
                <div className="text-center p-6">
                  <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                  <Button onClick={() => window.location.reload()}>Réessayer</Button>
                </div>
              </div>
            )}
            {!loading && !error && (
              <LeafletMap data={filteredData} center={[35.1714, -5.2694]} zoom={9} />
            )}
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <MapCharts species={filteredData.species} missions={filteredData.missions} />
    </div>
  );
}

