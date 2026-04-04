'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useGuest } from '../../../contexts/GuestContext';
import { api } from '../../../lib/api';
import { Location } from '../../../types/location';

const ShuttleTracker = dynamic(() => import('../../../components/map/ShuttleTracker'), { ssr: false });

export default function TransferPage() {
  const { guest, isLoading: guestLoading } = useGuest();
  const router = useRouter();

  const [fromSlug, setFromSlug] = useState('');
  const [toSlug, setToSlug] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transferConfirmed, setTransferConfirmed] = useState(false);
  const [driverInfo, setDriverInfo] = useState<{ name: string; phone: string; vehicle: string; plate: string } | null>(null);

  const { data: locations = [] } = useQuery<Location[]>({
    queryKey: ['locations'],
    queryFn: api.getLocations,
  });

  useEffect(() => {
    if (!guestLoading && !guest) router.push('/login');
  }, [guest, guestLoading, router]);

  const prefs = (guest?.preferences || {}) as Record<string, unknown>;
  const fromLocation = locations.find((l) => l.slug === fromSlug);
  const toLocation = locations.find((l) => l.slug === toSlug);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromLocation || !toLocation) return;
    setIsSubmitting(true);
    try {
      const res = await api.requestTransfer({
        fromLocationId: fromLocation.id,
        toLocationId: toLocation.id,
        profileId: guest?.id,
        departureTime: departureTime || undefined,
        roomPreferences: guest?.preferences,
      });
      setDriverInfo(res.driver);
      setTransferConfirmed(true);
    } catch (e) {
      console.error('Transfer failed:', e);
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
      <span className="text-secondary font-bold tracking-widest text-[11px] uppercase mb-2 block">The Kuriftu Loop</span>
      <h1 className="text-3xl md:text-4xl font-headline text-primary mb-3">Branch Transfer</h1>
      <p className="text-on-surface-variant mb-10">
        Move between Kuriftu branches seamlessly. Your room preferences follow you automatically.
      </p>

      {!transferConfirmed ? (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Preference summary */}
          <div className="bg-primary-fixed/20 rounded-xl p-5 flex items-start gap-4">
            <span className="material-symbols-outlined text-primary mt-0.5">person</span>
            <div>
              <p className="font-bold text-on-surface text-sm">{guest.full_name}</p>
              <p className="text-xs text-on-surface-variant mt-1">
                {String(prefs.bed_type || 'King')} bed · {String(prefs.room_temp || 22)}°C · {String(prefs.dietary || 'No dietary')} diet
              </p>
              <p className="text-[10px] uppercase tracking-widest text-primary font-bold mt-2">
                <span className="material-symbols-outlined text-[12px] align-middle mr-1">check_circle</span>
                These preferences will sync to your destination
              </p>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/10 space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">From</label>
              <select
                required
                value={fromSlug}
                onChange={(e) => setFromSlug(e.target.value)}
                className="w-full bg-surface-container-high border-b-2 border-outline-variant/40 p-4 focus:outline-none focus:border-primary transition-all font-body text-sm rounded-t-lg"
              >
                <option value="">Select departure branch</option>
                {locations.map((l) => (
                  <option key={l.id} value={l.slug}>{l.name}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-center">
              <div className="w-10 h-10 bg-surface-container rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-on-surface-variant">arrow_downward</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">To</label>
              <select
                required
                value={toSlug}
                onChange={(e) => setToSlug(e.target.value)}
                className="w-full bg-surface-container-high border-b-2 border-outline-variant/40 p-4 focus:outline-none focus:border-primary transition-all font-body text-sm rounded-t-lg"
              >
                <option value="">Select destination branch</option>
                {locations.filter((l) => l.slug !== fromSlug).map((l) => (
                  <option key={l.id} value={l.slug}>{l.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">Preferred Departure Time (Optional)</label>
              <input
                type="datetime-local"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                className="w-full bg-surface-container-high border-b-2 border-outline-variant/40 p-4 focus:outline-none focus:border-primary transition-all font-body text-sm rounded-t-lg"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !fromSlug || !toSlug}
            className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                Requesting...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">directions_bus</span>
                Confirm Transfer
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
            <h2 className="text-2xl font-headline text-primary mb-2">Transfer Confirmed</h2>
            <p className="text-on-surface-variant">
              Your shuttle from <strong>{fromLocation?.name}</strong> to <strong>{toLocation?.name}</strong> is being arranged.
            </p>
          </div>

          {/* Driver info */}
          {driverInfo && (
            <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/10">
              <h3 className="text-xs font-bold uppercase tracking-widest text-secondary mb-4">Your Driver</h3>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-primary-fixed rounded-full flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[28px]">person</span>
                </div>
                <div>
                  <p className="font-bold text-on-surface">{driverInfo.name}</p>
                  <p className="text-sm text-on-surface-variant">{driverInfo.vehicle} · {driverInfo.plate}</p>
                  <p className="text-sm text-primary font-medium">{driverInfo.phone}</p>
                </div>
              </div>
            </div>
          )}

          {/* Shuttle tracker */}
          {fromLocation && toLocation && (
            <div>
              <h3 className="text-lg font-headline text-primary mb-4">Live Tracking</h3>
              <ShuttleTracker from={fromLocation} to={toLocation} driverName={driverInfo?.name} plateNumber={driverInfo?.plate} />
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex-1 bg-surface-container-lowest text-primary py-4 rounded-xl font-bold hover:bg-surface-container-high transition-all border border-outline-variant/15"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => { setTransferConfirmed(false); setFromSlug(''); setToSlug(''); }}
              className="flex-1 bg-primary text-on-primary py-4 rounded-xl font-bold hover:opacity-90 transition-all"
            >
              New Transfer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
