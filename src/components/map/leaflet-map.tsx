/**
 * @file leaflet-map.tsx
 * @description src/components/map/leaflet-map.tsx
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-01
 * @updates 1
 * @lines 195
 * @size 5.62 KB
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
    latitude: number;
    longitude: number;
    startDate: string;
    endDate?: string;
    status?: string;
  }>;
  species?: Array<{
    id: string;
    scientificName: string;
    latitude: number;
    longitude: number;
    commonName?: string;
    observedAt?: string;
  }>;
  waterQuality?: Array<{
    id: string;
    location: string;
    latitude: number;
    longitude: number;
    type: string;
    date?: string;
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
  center = [35.0, -5.0], // Northern Morocco coordinates
  zoom = 8,
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
              <div>
                <strong>{mission.title}</strong>
                <br />
                <small>
                  {new Date(mission.startDate).toLocaleDateString("fr-FR")}
                  {mission.endDate && ` - ${new Date(mission.endDate).toLocaleDateString("fr-FR")}`}
                </small>
                {mission.status && (
                  <>
                    <br />
                    <span className="text-xs">Statut: {mission.status}</span>
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
              <div>
                <strong>{species.scientificName}</strong>
                {species.commonName && (
                  <>
                    <br />
                    <em>{species.commonName}</em>
                  </>
                )}
                {species.observedAt && (
                  <>
                    <br />
                    <small>Observé le: {new Date(species.observedAt).toLocaleDateString("fr-FR")}</small>
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
              <div>
                <strong>{water.location}</strong>
                <br />
                <small>Type: {water.type}</small>
                {water.date && (
                  <>
                    <br />
                    <small>Date: {new Date(water.date).toLocaleDateString("fr-FR")}</small>
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

