/**
 * @file leaflet-map.tsx
 * @description src/components/map/leaflet-map.tsx
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-01
 * @updates 2
 * @lines 322
 * @size 10.86 KB
 */
"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface MapData {
  missions?: Array<{
    id: string;
    title: string;
    description?: string;
    location?: string;
    latitude: number;
    longitude: number;
    startDate: string;
    endDate?: string;
    status?: string;
    objectives?: string;
  }>;
  species?: Array<{
    id: string;
    speciesId?: string;
    scientificName: string;
    latitude: number;
    longitude: number;
    commonName?: string;
    type?: string;
    iucnStatus?: string;
    habitat?: string;
    location?: string;
    observedAt?: string;
    notes?: string;
    photos?: Array<{ url: string; caption?: string }>;
  }>;
  waterQuality?: Array<{
    id: string;
    location: string;
    latitude: number;
    longitude: number;
    type: string;
    date?: string;
    ph?: number;
    temperature?: number;
    salinity?: number;
  }>;
  climateStations?: Array<{
    id: string;
    location: string;
    latitude: number;
    longitude: number;
  }>;
}

interface LeafletMapProps {
  data: MapData;
  center?: [number, number];
  zoom?: number;
  height?: string;
}

function MapUpdater({ center, zoom }: { center?: [number, number]; zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || 10);
    }
  }, [center, zoom, map]);
  return null;
}

export default function LeafletMap({
  data,
  center = [35.1714, -5.2694], // Chefchaouen, RIF Mountains - Northern Morocco
  zoom = 9,
  height = "600px",
}: LeafletMapProps) {
  return (
    <div style={{ height, width: "100%" }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater center={center} zoom={zoom} />

        {/* Mission markers */}
        {data.missions?.map((mission) => (
          <Marker
            key={`mission-${mission.id}`}
            position={[mission.latitude, mission.longitude]}
            icon={L.icon({
              iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
              iconSize: [25, 41],
              iconAnchor: [12, 41],
            })}
          >
            <Popup>
              <div className="min-w-[200px]">
                <strong className="text-base">{mission.title}</strong>
                {mission.location && (
                  <>
                    <br />
                    <span className="text-sm text-gray-600">📍 {mission.location}</span>
                  </>
                )}
                <br />
                <small className="text-xs text-gray-500">
                  {new Date(mission.startDate).toLocaleDateString("fr-FR")}
                  {mission.endDate && ` - ${new Date(mission.endDate).toLocaleDateString("fr-FR")}`}
                </small>
                {mission.status && (
                  <>
                    <br />
                    <span className={`text-xs px-2 py-1 rounded ${
                      mission.status === "completed" ? "bg-green-100 text-green-800" :
                      mission.status === "in_progress" ? "bg-blue-100 text-blue-800" :
                      mission.status === "planned" ? "bg-yellow-100 text-yellow-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {mission.status === "completed" ? "✓ Terminée" :
                       mission.status === "in_progress" ? "⟳ En cours" :
                       mission.status === "planned" ? "📅 Planifiée" : mission.status}
                    </span>
                  </>
                )}
                {mission.objectives && (
                  <>
                    <br />
                    <div className="mt-2 text-xs text-gray-600 max-h-20 overflow-y-auto">
                      {mission.objectives.substring(0, 100)}...
                    </div>
                  </>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Species markers */}
        {data.species?.map((species) => (
          <Marker
            key={`species-${species.id}`}
            position={[species.latitude, species.longitude]}
            icon={L.icon({
              iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
              iconSize: [25, 41],
              iconAnchor: [12, 41],
            })}
          >
            <Popup>
              <div className="min-w-[250px] max-w-[350px]">
                <strong className="text-base">{species.scientificName}</strong>
                {species.commonName && (
                  <>
                    <br />
                    <em className="text-sm text-gray-700">{species.commonName}</em>
                  </>
                )}
                {species.type && (
                  <>
                    <br />
                    <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-800 mt-1 inline-block">
                      {species.type === "FLORE_TERRESTRE" ? "🌿 Flore" :
                       species.type === "FAUNE_TERRESTRE" ? "🦌 Faune terrestre" :
                       species.type === "FAUNE_MARINE" ? "🐠 Faune marine" :
                       "🐟 Eau douce"}
                    </span>
                  </>
                )}
                {species.iucnStatus && (
                  <>
                    <br />
                    <span className="text-xs text-gray-600">IUCN: {species.iucnStatus}</span>
                  </>
                )}
                {species.location && (
                  <>
                    <br />
                    <span className="text-xs text-gray-600">📍 {species.location}</span>
                  </>
                )}
                {species.observedAt && (
                  <>
                    <br />
                    <small className="text-xs text-gray-500">
                      Observé le: {new Date(species.observedAt).toLocaleDateString("fr-FR")}
                    </small>
                  </>
                )}
                {species.habitat && (
                  <>
                    <br />
                    <small className="text-xs text-gray-600">Habitat: {species.habitat}</small>
                  </>
                )}
                {species.notes && (
                  <>
                    <br />
                    <div className="mt-1 text-xs text-gray-600 max-h-16 overflow-y-auto">
                      {species.notes}
                    </div>
                  </>
                )}
                {species.photos && species.photos.length > 0 && (
                  <>
                    <br />
                    <div className="mt-2">
                      <img 
                        src={species.photos[0].url} 
                        alt={species.commonName || species.scientificName}
                        className="w-full h-24 object-cover rounded border"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://via.placeholder.com/200x150?text=${encodeURIComponent(species.scientificName)}`;
                        }}
                      />
                      {species.photos[0].caption && (
                        <small className="text-xs text-gray-500 block mt-1">{species.photos[0].caption}</small>
                      )}
                    </div>
                  </>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Water quality points */}
        {data.waterQuality?.map((water) => (
          <Circle
            key={`water-${water.id}`}
            center={[water.latitude, water.longitude]}
            radius={1000}
            pathOptions={{ color: "blue", fillColor: "blue", fillOpacity: 0.2 }}
          >
            <Popup>
              <div className="min-w-[200px]">
                <strong className="text-base">{water.location}</strong>
                <br />
                <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800 mt-1 inline-block">
                  {water.type === "MER" ? "🌊 Mer" :
                   water.type === "SOURCE" ? "💧 Source" :
                   "🏔️ Barrage"}
                </span>
                {water.date && (
                  <>
                    <br />
                    <small className="text-xs text-gray-500">
                      Date: {new Date(water.date).toLocaleDateString("fr-FR")}
                    </small>
                  </>
                )}
                {water.ph !== undefined && (
                  <>
                    <br />
                    <small className="text-xs text-gray-600">pH: {water.ph}</small>
                  </>
                )}
                {water.temperature !== undefined && (
                  <>
                    <br />
                    <small className="text-xs text-gray-600">Température: {water.temperature}°C</small>
                  </>
                )}
                {water.salinity !== undefined && (
                  <>
                    <br />
                    <small className="text-xs text-gray-600">Salinité: {water.salinity} g/L</small>
                  </>
                )}
              </div>
            </Popup>
          </Circle>
        ))}

        {/* Climate stations */}
        {data.climateStations?.map((station) => (
          <Marker
            key={`station-${station.id}`}
            position={[station.latitude, station.longitude]}
            icon={L.icon({
              iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
              iconSize: [25, 41],
              iconAnchor: [12, 41],
            })}
          >
            <Popup>
              <div>
                <strong>Station: {station.location}</strong>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

