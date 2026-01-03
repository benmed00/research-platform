/**
 * @file map-export.ts
 * @description Utility functions for exporting map data to GeoJSON and CSV
 */

export interface MapExportData {
  missions?: Array<{
    id: string;
    title: string;
    latitude: number;
    longitude: number;
    location?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }>;
  species?: Array<{
    id: string;
    scientificName: string;
    commonName?: string;
    latitude: number;
    longitude: number;
    type?: string;
    iucnStatus?: string;
    location?: string;
    observedAt?: string;
  }>;
  waterQuality?: Array<{
    id: string;
    location: string;
    latitude: number;
    longitude: number;
    type: string;
    ph?: number;
    temperature?: number;
    date?: string;
  }>;
  climateStations?: Array<{
    id: string;
    location: string;
    latitude: number;
    longitude: number;
  }>;
}

/**
 * Convert map data to GeoJSON format
 */
export function exportToGeoJSON(data: MapExportData): string {
  const features: any[] = [];

  // Add missions
  if (data.missions) {
    data.missions.forEach((mission) => {
      features.push({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [mission.longitude, mission.latitude],
        },
        properties: {
          id: mission.id,
          type: "mission",
          title: mission.title,
          location: mission.location || "",
          status: mission.status || "",
          startDate: mission.startDate || "",
          endDate: mission.endDate || "",
        },
      });
    });
  }

  // Add species
  if (data.species) {
    data.species.forEach((species) => {
      features.push({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [species.longitude, species.latitude],
        },
        properties: {
          id: species.id,
          type: "species",
          scientificName: species.scientificName,
          commonName: species.commonName || "",
          speciesType: species.type || "",
          iucnStatus: species.iucnStatus || "",
          location: species.location || "",
          observedAt: species.observedAt || "",
        },
      });
    });
  }

  // Add water quality points
  if (data.waterQuality) {
    data.waterQuality.forEach((water) => {
      features.push({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [water.longitude, water.latitude],
        },
        properties: {
          id: water.id,
          type: "water_quality",
          location: water.location,
          waterType: water.type,
          ph: water.ph || null,
          temperature: water.temperature || null,
          date: water.date || "",
        },
      });
    });
  }

  // Add climate stations
  if (data.climateStations) {
    data.climateStations.forEach((station) => {
      features.push({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [station.longitude, station.latitude],
        },
        properties: {
          id: station.id,
          type: "climate_station",
          location: station.location,
        },
      });
    });
  }

  const geoJSON = {
    type: "FeatureCollection",
    features,
    metadata: {
      exportDate: new Date().toISOString(),
      totalFeatures: features.length,
      source: "Research Platform - Rif Region",
    },
  };

  return JSON.stringify(geoJSON, null, 2);
}

/**
 * Convert map data to CSV format
 */
export function exportToCSV(data: MapExportData): string {
  const rows: string[][] = [];

  // Header
  const headers = [
    "Type",
    "ID",
    "Latitude",
    "Longitude",
    "Location",
    "Additional Info",
  ];
  rows.push(headers);

  // Add missions
  if (data.missions) {
    data.missions.forEach((mission) => {
      rows.push([
        "Mission",
        mission.id,
        mission.latitude.toString(),
        mission.longitude.toString(),
        mission.location || "",
        `Titre: ${mission.title}; Statut: ${mission.status || ""}; Dates: ${mission.startDate || ""} - ${mission.endDate || ""}`,
      ]);
    });
  }

  // Add species
  if (data.species) {
    data.species.forEach((species) => {
      rows.push([
        "Espèce",
        species.id,
        species.latitude.toString(),
        species.longitude.toString(),
        species.location || "",
        `Nom scientifique: ${species.scientificName}; Nom commun: ${species.commonName || ""}; Type: ${species.type || ""}; IUCN: ${species.iucnStatus || ""}`,
      ]);
    });
  }

  // Add water quality points
  if (data.waterQuality) {
    data.waterQuality.forEach((water) => {
      rows.push([
        "Qualité d'eau",
        water.id,
        water.latitude.toString(),
        water.longitude.toString(),
        water.location,
        `Type: ${water.type}; pH: ${water.ph || "N/A"}; Température: ${water.temperature || "N/A"}°C`,
      ]);
    });
  }

  // Add climate stations
  if (data.climateStations) {
    data.climateStations.forEach((station) => {
      rows.push([
        "Station météo",
        station.id,
        station.latitude.toString(),
        station.longitude.toString(),
        station.location,
        "",
      ]);
    });
  }

  // Convert to CSV string
  return rows
    .map((row) =>
      row
        .map((cell) => {
          // Escape quotes and wrap in quotes if contains comma or quote
          const cellStr = String(cell || "");
          if (cellStr.includes(",") || cellStr.includes('"') || cellStr.includes("\n")) {
            return `"${cellStr.replace(/"/g, '""')}"`;
          }
          return cellStr;
        })
        .join(",")
    )
    .join("\n");
}

/**
 * Download a file with the given content
 */
export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

