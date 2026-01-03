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
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";

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

// Component to handle marker clustering
function MarkerClusterGroup({ data, type }: { data: any[]; type: 'missions' | 'species' | 'climateStations' }) {
  const map = useMap();
  const clusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Create cluster group with custom styling
    const clusterGroup = (L as any).markerClusterGroup({
      chunkedLoading: true,
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      iconCreateFunction: (cluster: any) => {
        const count = cluster.getChildCount();
        let size = 'small';
        if (count > 100) size = 'large';
        else if (count > 20) size = 'medium';

        const color = type === 'missions' ? 'blue' : type === 'species' ? 'green' : 'red';
        
        return L.divIcon({
          html: `<div style="background-color: ${color}; color: white; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${count}</div>`,
          className: 'marker-cluster',
          iconSize: L.point(40, 40),
        });
      },
    });

    // Create markers based on type
    data.forEach((item) => {
      const iconUrl = 
        type === 'missions' 
          ? "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png"
          : type === 'species'
          ? "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png"
          : "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png";

      const marker = L.marker([item.latitude, item.longitude], {
        icon: L.icon({
          iconUrl,
          iconSize: [25, 41],
          iconAnchor: [12, 41],
        }),
      });

      // Create popup content
      let popupContent = '';
      if (type === 'missions') {
        popupContent = `
          <div style="min-width: 200px;">
            <strong style="font-size: 16px;">${item.title}</strong>
            ${item.location ? `<br><span style="font-size: 14px; color: #666;">📍 ${item.location}</span>` : ''}
            <br><small style="font-size: 12px; color: #999;">${new Date(item.startDate).toLocaleDateString("fr-FR")}</small>
            ${item.status ? `<br><span style="font-size: 12px; padding: 2px 8px; border-radius: 4px; background: ${item.status === 'completed' ? '#d1fae5' : item.status === 'in_progress' ? '#dbeafe' : '#fef3c7'}; color: ${item.status === 'completed' ? '#065f46' : item.status === 'in_progress' ? '#1e40af' : '#92400e'};">
              ${item.status === 'completed' ? '✓ Terminée' : item.status === 'in_progress' ? '⟳ En cours' : '📅 Planifiée'}
            </span>` : ''}
          </div>
        `;
      } else if (type === 'species') {
        const photoHtml = item.photos && item.photos.length > 0 
          ? `<img src="${item.photos[0].url}" alt="${item.commonName || item.scientificName}" style="width: 100%; height: 96px; object-fit: cover; border-radius: 4px; margin-top: 8px;" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI2U1ZTdlYiIvPjx0ZXh0IHg9IjEwMCIgeT0iNzUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzZiNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+IEltYWdlIG5vbiBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg=='" />`
          : '';
        
        popupContent = `
          <div style="min-width: 250px; max-width: 350px;">
            <strong style="font-size: 16px;">${item.scientificName}</strong>
            ${item.commonName ? `<br><em style="font-size: 14px; color: #374151;">${item.commonName}</em>` : ''}
            ${item.type ? `<br><span style="font-size: 12px; padding: 4px 8px; border-radius: 4px; background: #d1fae5; color: #065f46; margin-top: 4px; display: inline-block;">
              ${item.type === 'FLORE_TERRESTRE' ? '🌿 Flore' : item.type === 'FAUNE_TERRESTRE' ? '🦌 Faune terrestre' : item.type === 'FAUNE_MARINE' ? '🐠 Faune marine' : '🐟 Eau douce'}
            </span>` : ''}
            ${item.location ? `<br><span style="font-size: 12px; color: #666;">📍 ${item.location}</span>` : ''}
            ${item.observedAt ? `<br><small style="font-size: 12px; color: #999;">Observé le: ${new Date(item.observedAt).toLocaleDateString("fr-FR")}</small>` : ''}
            ${photoHtml}
          </div>
        `;
      } else {
        popupContent = `<div><strong>Station: ${item.location}</strong></div>`;
      }

      marker.bindPopup(popupContent);
      clusterGroup.addLayer(marker);
    });

    clusterGroupRef.current = clusterGroup;
    map.addLayer(clusterGroup);

    return () => {
      if (clusterGroupRef.current) {
        map.removeLayer(clusterGroupRef.current);
        clusterGroupRef.current = null;
      }
    };
  }, [data, type, map]);

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

        {/* Mission markers with clustering */}
        {data.missions && data.missions.length > 0 && (
          <MarkerClusterGroup data={data.missions} type="missions" />
        )}

        {/* Species markers with clustering */}
        {data.species && data.species.length > 0 && (
          <MarkerClusterGroup data={data.species} type="species" />
        )}

        {/* Water quality points (no clustering, using circles) */}
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

        {/* Climate stations with clustering */}
        {data.climateStations && data.climateStations.length > 0 && (
          <MarkerClusterGroup data={data.climateStations} type="climateStations" />
        )}
      </MapContainer>
    </div>
  );
}

