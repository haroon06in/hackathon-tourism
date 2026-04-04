'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useGuest } from '../../../contexts/GuestContext';
import { api } from '../../../lib/api';
import { Location } from '../../../types/location';

const ShuttleTracker = dynamic(() => import('../../../components/map/ShuttleTracker'), { ssr: false });

const VEHICLE_OPTIONS = [
  { id: 'sedan', name: 'Sedan', desc: 'Comfortable ride for 1-3 guests', icon: 'directions_car', capacity: 3 },
  { id: 'suv', name: 'SUV', desc: 'Spacious for families and luggage', icon: 'airport_shuttle', capacity: 5 },
  { id: 'van', name: 'VIP Van', desc: 'Premium group transport', icon: 'directions_bus', capacity: 8 },
];

// Simulated airport location
const AIRPORT_LOCATION: Location = {
  id: 'airport',
  name: 'Bole International Airport',
  slug: 'bole-airport',
  description: 'Addis Ababa Bole International Airport',
  latitude: 8.9779,
  longitude: 38.7993,
  address: 'Addis Ababa, Ethiopia',
  amenities: [],
  menu: [],
};

export default function PickupPage() {
  const { guest, isLoading: guestLoading } = useGuest();
  const router = useRouter();

  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [destinationSlug, setDestinationSlug] = useState('');
  const [flightNumber, setFlightNumber] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [pickupConfirmed, setPickupConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: locations = [] } = useQuery<Location[]>({
    queryKey: ['locations'],
    queryFn: api.getLocations,
  });

  useEffect(() => {
    if (!guestLoading && !guest) router.push('/login');
  }, [guest, guestLoading, router]);

  const prefs = (guest?.preferences || {}) as Record<string, unknown>;
  const destination = locations.find((l) => l.slug === destinationSlug);

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination) return;
    setIsSubmitting(true);
    try {
      await api.requestTransfer({
        fromLocationId: 'airport',
        toLocationId: destination.id,
        profileId: guest?.id,
        departureTime: arrivalTime || undefined,
        roomPreferences: guest?.preferences,
      });
      setPickupConfirmed(true);
    } catch (err) {
      console.error('Pickup request failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (guestLoading || !guest) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 pb-24 pt-8 animate-in fade-in duration-500 w-full">
      <span className="text-secondary font-bold tracking-widest text-[11px] uppercase mb-2 block">Arrival Service</span>
      <h1 className="text-3xl md:text-4xl font-headline text-primary mb-3">Airport Pickup</h1>
      <p className="text-on-surface-variant mb-10">
        We&apos;ll have a driver waiting for you at Bole International Airport. Your room will be ready when you arrive.
      </p>

      {!pickupConfirmed ? (
        <form onSubmit={handleConfirm} className="space-y-8">
          {/* Vehicle Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-4">Choose Your Vehicle</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {VEHICLE_OPTIONS.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedVehicle(v.id)}
                  className={`p-5 rounded-2xl text-left transition-all border ${
                    selectedVehicle === v.id
                      ? 'bg-primary-fixed/20 border-primary shadow-sm'
                      : 'bg-surface-container-lowest border-outline-variant/10 hover:border-primary/30'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                    selectedVehicle === v.id ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'
                  }`}>
                    <span className="material-symbols-outlined">{v.icon}</span>
                  </div>
                  <p className="font-headline text-primary mb-1">{v.name}</p>
                  <p className="text-xs text-on-surface-variant">{v.desc}</p>
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mt-2">Up to {v.capacity} guests</p>
                </button>
              ))}
            </div>
          </div>

          {/* Trip details */}
          <div className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/10 space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">Destination Branch</label>
              <select
                required
                value={destinationSlug}
                onChange={(e) => setDestinationSlug(e.target.value)}
                className="w-full bg-surface-container-high border-b-2 border-outline-variant/40 p-4 focus:outline-none focus:border-primary transition-all font-body text-sm rounded-t-lg"
              >
                <option value="">Select your Kuriftu branch</option>
                {locations.map((l) => (
                  <option key={l.id} value={l.slug}>{l.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">Flight Number (Optional)</label>
                <input
                  type="text"
                  value={flightNumber}
                  onChange={(e) => setFlightNumber(e.target.value)}
                  placeholder="ET 302"
                  className="w-full bg-surface-container-high border-b-2 border-outline-variant/40 p-4 focus:outline-none focus:border-primary transition-all font-body text-sm rounded-t-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">Arrival Time</label>
                <input
                  type="datetime-local"
                  required
                  value={arrivalTime}
                  onChange={(e) => setArrivalTime(e.target.value)}
                  className="w-full bg-surface-container-high border-b-2 border-outline-variant/40 p-4 focus:outline-none focus:border-primary transition-all font-body text-sm rounded-t-lg"
                />
              </div>
            </div>
          </div>

          {/* Preference reminder */}
          <div className="bg-primary-fixed/20 rounded-xl p-5 flex items-start gap-4">
            <span className="material-symbols-outlined text-primary mt-0.5">info</span>
            <div>
              <p className="text-sm font-medium text-on-surface">Your room will be ready on arrival</p>
              <p className="text-xs text-on-surface-variant mt-1">
                {String(prefs.bed_type || 'King')} bed · {String(prefs.room_temp || 22)}°C · {String(prefs.dietary || 'No dietary')} preference — all set at your destination.
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !selectedVehicle || !destinationSlug || !arrivalTime}
            className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                Arranging...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">local_taxi</span>
                Confirm Pickup
              </>
            )}
          </button>
        </form>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Confirmation */}
          <div className="bg-primary-fixed/20 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-primary text-on-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-[32px]">check</span>
            </div>
            <h2 className="text-2xl font-headline text-primary mb-2">Pickup Confirmed</h2>
            <p className="text-on-surface-variant">
              A driver will be waiting for you at <strong>Bole International Airport</strong>.
              {flightNumber && <> We&apos;re tracking flight <strong>{flightNumber}</strong>.</>}
            </p>
          </div>

          {/* Driver info */}
          <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/10">
            <h3 className="text-xs font-bold uppercase tracking-widest text-secondary mb-4">Your Driver</h3>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-primary-fixed rounded-full flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[28px]">person</span>
              </div>
              <div>
                <p className="font-bold text-on-surface">Abebe Kebede</p>
                <p className="text-sm text-on-surface-variant">
                  {VEHICLE_OPTIONS.find((v) => v.id === selectedVehicle)?.name || 'Vehicle'} · AA-3-14159
                </p>
                <p className="text-sm text-primary font-medium">+251 91 234 5678</p>
              </div>
            </div>
          </div>

          {/* Live tracking */}
          {destination && (
            <div>
              <h3 className="text-lg font-headline text-primary mb-4">Live Tracking</h3>
              <ShuttleTracker
                from={AIRPORT_LOCATION}
                to={destination}
                driverName="Abebe Kebede"
                plateNumber="AA-3-14159"
              />
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex-1 bg-surface-container-lowest text-primary py-4 rounded-xl font-bold hover:bg-surface-container-high transition-all border border-outline-variant/15"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
