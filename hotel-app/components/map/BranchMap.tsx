'use client';

import { useEffect, useState } from 'react';
import { Location } from '../../types/location';

export default function BranchMap() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [MapComponents, setMapComponents] = useState<{
    MapContainer: typeof import('react-leaflet').MapContainer;
    TileLayer: typeof import('react-leaflet').TileLayer;
    Marker: typeof import('react-leaflet').Marker;
    Popup: typeof import('react-leaflet').Popup;
    Polyline: typeof import('react-leaflet').Polyline;
  } | null>(null);
  const [icon, setIcon] = useState<L.Icon | null>(null);

  useEffect(() => {
    // Dynamic import to avoid SSR issues with Leaflet
    Promise.all([
      import('react-leaflet'),
      import('leaflet'),
      import('leaflet/dist/leaflet.css'),
    ]).then(([rl, L]) => {
      setMapComponents({
        MapContainer: rl.MapContainer,
        TileLayer: rl.TileLayer,
        Marker: rl.Marker,
        Popup: rl.Popup,
        Polyline: rl.Polyline,
      });
      setIcon(
        new L.Icon({
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
        })
      );
    });
  }, []);

  useEffect(() => {
    fetch('/api/locations')
      .then((res) => res.json())
      .then(setLocations)
      .catch(console.error);
  }, []);

  if (!MapComponents || !icon || locations.length === 0) {
    return (
      <div className="w-full h-[400px] bg-surface-container rounded-xl flex items-center justify-center">
        <p className="text-on-surface/50 font-body text-sm">Loading map...</p>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup, Polyline } = MapComponents;

  // Center on Ethiopia
  const center: [number, number] = [9.5, 38.7];

  // Shuttle route connecting all branches in order
  const routeCoords: [number, number][] = locations.map((l) => [l.latitude, l.longitude]);

  return (
    <MapContainer
      center={center}
      zoom={6}
      scrollWheelZoom={false}
      className="w-full h-[400px] rounded-xl z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.map((loc) => (
        <Marker key={loc.id} position={[loc.latitude, loc.longitude]} icon={icon}>
          <Popup>
            <div className="font-body">
              <strong className="font-serif">{loc.name}</strong>
              <p className="text-xs mt-1">{loc.description}</p>
              <p className="text-xs text-stone-500 mt-1">{loc.address}</p>
            </div>
          </Popup>
        </Marker>
      ))}
      <Polyline
        positions={routeCoords}
        pathOptions={{ color: '#163422', weight: 2, dashArray: '8 4' }}
      />
    </MapContainer>
  );
}
