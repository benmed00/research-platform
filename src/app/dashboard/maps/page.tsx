/**
 * @file page.tsx
 * @description src/app/dashboard/maps/page.tsx
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-01
 * @updates 1
 * @lines 196
 * @size 7.36 KB
 */
"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Layers, Upload } from "lucide-react";
import { useState, useEffect, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";

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

  useEffect(() => {
    async function fetchMapData() {
      try {
        const [missionsRes, speciesRes, waterRes, climateRes] = await Promise.all([
          fetch("/api/missions"),
          fetch("/api/species"),
          fetch("/api/water-quality"),
          fetch("/api/climate-data"),
        ]);

        // Handle different response formats
        const missionsData = missionsRes.ok ? await missionsRes.json() : [];
        const speciesData = speciesRes.ok ? await speciesRes.json() : [];
        const waterData = waterRes.ok ? await waterRes.json() : [];
        const climateData = climateRes.ok ? await climateRes.json() : [];

        // Normalize data (some APIs return arrays, others return { data: [] })
        const missions = Array.isArray(missionsData) ? missionsData : missionsData.data || [];
        const species = Array.isArray(speciesData) ? speciesData : speciesData.data || [];
        const water = Array.isArray(waterData) ? waterData : waterData.data || [];
        const climate = Array.isArray(climateData) ? climateData : climateData.data || [];

        // Fetch species locations separately (they're in a different table)
        const speciesWithLocations: any[] = [];
        for (const s of species.slice(0, 50)) { // Limit to avoid too many requests
          try {
            const speciesDetailRes = await fetch(`/api/species/${s.id}`);
            if (speciesDetailRes.ok) {
              const speciesDetail = await speciesDetailRes.json();
              if (speciesDetail.locations && speciesDetail.locations.length > 0) {
                speciesDetail.locations.forEach((loc: any) => {
                  speciesWithLocations.push({
                    id: `${s.id}-${loc.id}`,
                    scientificName: s.scientificName,
                    commonName: s.commonName,
                    latitude: loc.latitude,
                    longitude: loc.longitude,
                    observedAt: loc.observedAt,
                  });
                });
              }
            }
          } catch (e) {
            // Skip if error
          }
        }

        setMapData({
          missions: missions
            .filter((m: any) => m.latitude && m.longitude)
            .map((m: any) => ({
              id: m.id,
              title: m.title,
              latitude: m.latitude,
              longitude: m.longitude,
              startDate: m.startDate,
              endDate: m.endDate,
              status: m.status,
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
      } catch (error) {
        console.error("Error fetching map data:", error);
      }
    }
    fetchMapData();
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

  const filteredData = useMemo(() => ({
    missions: selectedLayers.has("missions") ? mapData.missions : [],
    species: selectedLayers.has("species") ? mapData.species : [],
    waterQuality: selectedLayers.has("waterQuality") ? mapData.waterQuality : [],
    climateStations: selectedLayers.has("climateStations") ? mapData.climateStations : [],
  }), [selectedLayers, mapData]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            SIG & Cartographie
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400 mt-1.5">
            Visualisation géographique des données
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Importer GeoJSON
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card variant="elevated" className="lg:col-span-1 p-6">
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

        <Card variant="elevated" className="lg:col-span-3 p-6">
          <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm" style={{ height: "600px" }}>
            <LeafletMap data={filteredData} center={[35.0, -5.0]} zoom={8} />
          </div>
        </Card>
      </div>
    </div>
  );
}

