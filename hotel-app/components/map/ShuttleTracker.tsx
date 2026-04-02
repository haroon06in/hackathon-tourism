'use client';

import { useEffect, useState } from 'react';
import { Location } from '../../types/location';

interface ShuttleTrackerProps {
  from: Location;
  to: Location;
  driverName?: string;
  plateNumber?: string;
}

export default function ShuttleTracker({ from, to, driverName = 'Abebe Kebede', plateNumber = 'AA-3-14159' }: ShuttleTrackerProps) {
  const [MapComponents, setMapComponents] = useState<{
    MapContainer: typeof import('react-leaflet').MapContainer;
    TileLayer: typeof import('react-leaflet').TileLayer;
    Marker: typeof import('react-leaflet').Marker;
    Popup: typeof import('react-leaflet').Popup;
    Polyline: typeof import('react-leaflet').Polyline;
  } | null>(null);
  const [icons, setIcons] = useState<{ branch: L.Icon; shuttle: L.DivIcon } | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
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
      setIcons({
        branch: new L.Icon({
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
        }),
        shuttle: new L.DivIcon({
          html: '<div style="background:#163422;color:white;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 2px 8px rgba(0,0,0,0.3);">🚐</div>',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        }),
      });
    });
  }, []);

  // Simulate shuttle movement
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 1) return 1;
        return prev + 0.005;
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  if (!MapComponents || !icons) {
    return (
      <div className="w-full h-[350px] bg-surface-container rounded-xl flex items-center justify-center">
        <p className="text-on-surface/50 font-body text-sm">Loading shuttle tracker...</p>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup, Polyline } = MapComponents;

  const shuttleLat = from.latitude + (to.latitude - from.latitude) * progress;
  const shuttleLng = from.longitude + (to.longitude - from.longitude) * progress;

  const centerLat = (from.latitude + to.latitude) / 2;
  const centerLng = (from.longitude + to.longitude) / 2;

  const etaMinutes = Math.max(1, Math.round((1 - progress) * 45));

  return (
    <div className="space-y-4">
      {/* Driver info bar */}
      <div className="flex items-center justify-between bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-fixed rounded-full flex items-center justify-center text-primary">
            <span className="material-symbols-outlined">person</span>
          </div>
          <div>
            <p className="font-bold text-on-surface text-sm">{driverName}</p>
            <p className="text-xs text-on-surface-variant">{plateNumber} · Toyota HiAce</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">{etaMinutes}</p>
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">min eta</p>
        </div>
      </div>

      {/* Map */}
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={8}
        scrollWheelZoom={false}
        className="w-full h-[300px] rounded-xl z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[from.latitude, from.longitude]} icon={icons.branch}>
          <Popup><strong>{from.name}</strong><br />Departure</Popup>
        </Marker>
        <Marker position={[to.latitude, to.longitude]} icon={icons.branch}>
          <Popup><strong>{to.name}</strong><br />Destination</Popup>
        </Marker>
        <Marker position={[shuttleLat, shuttleLng]} icon={icons.shuttle}>
          <Popup>Your shuttle · {etaMinutes} min away</Popup>
        </Marker>
        <Polyline
          positions={[[from.latitude, from.longitude], [to.latitude, to.longitude]]}
          pathOptions={{ color: '#163422', weight: 3, dashArray: '8 4' }}
        />
      </MapContainer>

      {/* Progress bar */}
      <div className="bg-surface-container-high rounded-full h-2 overflow-hidden">
        <div
          className="bg-primary h-full rounded-full transition-all duration-200"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      <div className="flex justify-between text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
        <span>{from.name.replace('Kuriftu ', '')}</span>
        <span>{to.name.replace('Kuriftu ', '')}</span>
      </div>
    </div>
  );
}
