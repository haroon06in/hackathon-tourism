'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { api } from '../../../lib/api';
import { Location } from '../../../types/location';

const ShuttleTracker = dynamic(() => import('../../../components/map/ShuttleTracker'), { ssr: false });

// Mock guest data (would come from auth in production)
const MOCK_GUEST = {
  name: 'Liya Tadesse',
  persona: 'adventurous',
  currentBranch: 'bishoftu',
  preferences: { dietary: 'vegan', bed_type: 'king', room_temp: 22 },
};

// Simulated upcoming itinerary
const MOCK_ITINERARY = [
  { id: '1', type: 'hotel', title: 'Lakeside Suite Check-in', location: 'Kuriftu Bishoftu', time: '14:00', date: 'Today', status: 'completed', icon: 'hotel' },
  { id: '2', type: 'activity', title: 'Sunset Kayaking', location: 'Lake Kuriftu', time: '16:00', date: 'Today', status: 'upcoming', icon: 'kayaking' },
  { id: '3', type: 'transport', title: 'Shuttle to Entoto', location: 'Kuriftu Entoto', time: '09:00', date: 'Tomorrow', status: 'scheduled', icon: 'directions_bus' },
  { id: '4', type: 'activity', title: 'Zipline Adventure', location: 'Entoto Mountains', time: '11:00', date: 'Tomorrow', status: 'scheduled', icon: 'paragliding' },
  { id: '5', type: 'hotel', title: 'Highland Suite Check-in', location: 'Kuriftu Entoto', time: '15:00', date: 'Tomorrow', status: 'scheduled', icon: 'hotel' },
];

const ACTIVITY_SUGGESTIONS = [
  { name: 'Lakeside Spa Ritual', reason: 'Matches your wellness interests', price: 85, duration: '2 hours', icon: 'spa' },
  { name: 'Forest Trail Hike', reason: 'Perfect for adventurous personas', price: 30, duration: '3 hours', icon: 'hiking' },
  { name: 'Island Monastery Tour', reason: 'Highly rated cultural experience', price: 75, duration: '4 hours', icon: 'church' },
];

export default function DashboardPage() {
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferFrom, setTransferFrom] = useState('');
  const [transferTo, setTransferTo] = useState('');
  const [transferRequested, setTransferRequested] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  const { data: locations = [] } = useQuery<Location[]>({
    queryKey: ['locations'],
    queryFn: api.getLocations,
  });

  useEffect(() => {
    const update = () => setCurrentTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  const fromLocation = locations.find((l) => l.slug === (transferFrom || 'bishoftu'));
  const toLocation = locations.find((l) => l.slug === (transferTo || 'entoto'));

  const handleTransferRequest = async () => {
    if (!fromLocation || !toLocation) return;
    try {
      await api.requestTransfer({
        fromLocationId: fromLocation.id,
        toLocationId: toLocation.id,
        roomPreferences: MOCK_GUEST.preferences,
      });
      setTransferRequested(true);
      setShowTransferModal(false);
    } catch (e) {
      console.error('Transfer request failed:', e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pb-24 pt-8 md:pt-12 animate-in fade-in duration-500 w-full">
      {/* Header */}
      <header className="mb-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <span className="text-secondary font-bold tracking-widest text-[11px] uppercase mb-2 block">Guest Dashboard</span>
            <h1 className="text-4xl md:text-5xl font-headline text-primary tracking-tight">
              Welcome, {MOCK_GUEST.name.split(' ')[0]}
            </h1>
            <p className="text-on-surface-variant mt-2">
              Currently at <strong className="text-primary">Kuriftu Bishoftu</strong> · {currentTime}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowTransferModal(true)}
              className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all active:scale-95 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">swap_horiz</span>
              Request Transfer
            </button>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Current Branch', value: 'Bishoftu', icon: 'location_on', color: 'bg-primary-fixed text-primary' },
            { label: 'Room Temp', value: `${MOCK_GUEST.preferences.room_temp}°C`, icon: 'thermostat', color: 'bg-secondary-container text-on-secondary-container' },
            { label: 'Next Activity', value: '4:00 PM', icon: 'schedule', color: 'bg-tertiary-container text-on-tertiary-container' },
            { label: 'Persona', value: MOCK_GUEST.persona, icon: 'person', color: 'bg-surface-container text-on-surface' },
          ].map((stat) => (
            <div key={stat.label} className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/10">
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
                <span className="material-symbols-outlined text-[20px]">{stat.icon}</span>
              </div>
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">{stat.label}</p>
              <p className="text-lg font-bold text-on-surface capitalize">{stat.value}</p>
            </div>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column — Itinerary */}
        <div className="lg:col-span-2 space-y-8">
          {/* Living Itinerary */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-headline text-primary">Living Itinerary</h2>
              <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">The Kuriftu Loop</span>
            </div>

            <div className="space-y-1">
              {MOCK_ITINERARY.map((item, idx) => (
                <div key={item.id} className="flex gap-4">
                  {/* Timeline line */}
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      item.status === 'completed' ? 'bg-primary text-on-primary' :
                      item.status === 'upcoming' ? 'bg-secondary-container text-on-secondary-container' :
                      'bg-surface-container text-on-surface-variant'
                    }`}>
                      <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                    </div>
                    {idx < MOCK_ITINERARY.length - 1 && (
                      <div className={`w-0.5 flex-1 my-1 ${item.status === 'completed' ? 'bg-primary/30' : 'bg-outline-variant/20'}`} />
                    )}
                  </div>

                  {/* Content */}
                  <div className={`flex-1 pb-6 ${item.status === 'completed' ? 'opacity-60' : ''}`}>
                    <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/10">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold text-on-surface">{item.title}</p>
                          <p className="text-sm text-on-surface-variant mt-1">{item.location}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-primary">{item.time}</p>
                          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">{item.date}</p>
                        </div>
                      </div>
                      {item.status === 'completed' && (
                        <span className="inline-flex items-center gap-1 mt-3 text-[10px] uppercase tracking-widest font-bold text-primary">
                          <span className="material-symbols-outlined text-[14px]">check_circle</span> Completed
                        </span>
                      )}
                      {item.status === 'upcoming' && (
                        <span className="inline-flex items-center gap-1 mt-3 text-[10px] uppercase tracking-widest font-bold text-secondary">
                          <span className="material-symbols-outlined text-[14px] animate-pulse">circle</span> Up Next
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Shuttle Tracker */}
          {transferRequested && fromLocation && toLocation && (
            <section className="animate-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-headline text-primary mb-6">Shuttle Tracking</h2>
              <ShuttleTracker from={fromLocation} to={toLocation} />
            </section>
          )}
        </div>

        {/* Right Column — Sidebar */}
        <div className="space-y-8">
          {/* AI Activity Suggestions */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-secondary text-[20px]">auto_awesome</span>
              <h3 className="text-lg font-headline text-primary">Aura Suggests</h3>
            </div>
            <div className="space-y-3">
              {ACTIVITY_SUGGESTIONS.map((activity) => (
                <div key={activity.name} className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/10 hover:border-primary/20 transition-all cursor-pointer group">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary-fixed text-primary rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-[20px]">{activity.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-on-surface text-sm">{activity.name}</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">{activity.reason}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs font-bold text-primary">${activity.price}</span>
                        <span className="text-[10px] text-on-surface-variant">{activity.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Room Preferences */}
          <section>
            <h3 className="text-lg font-headline text-primary mb-4">Room Preferences</h3>
            <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/10 space-y-4">
              {[
                { label: 'Bed Type', value: MOCK_GUEST.preferences.bed_type, icon: 'bed' },
                { label: 'Room Temperature', value: `${MOCK_GUEST.preferences.room_temp}°C`, icon: 'thermostat' },
                { label: 'Dietary', value: MOCK_GUEST.preferences.dietary, icon: 'restaurant' },
              ].map((pref) => (
                <div key={pref.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-on-surface-variant text-[18px]">{pref.icon}</span>
                    <span className="text-sm text-on-surface-variant">{pref.label}</span>
                  </div>
                  <span className="text-sm font-bold text-on-surface capitalize">{pref.value}</span>
                </div>
              ))}
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold pt-2 border-t border-outline-variant/10">
                <span className="material-symbols-outlined text-[12px] align-middle mr-1">check_circle</span>
                Synced across all branches
              </p>
            </div>
          </section>

          {/* Quick Actions */}
          <section>
            <h3 className="text-lg font-headline text-primary mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Room Service', icon: 'room_service', href: '/concierge' },
                { label: 'Spa Booking', icon: 'spa', href: '/activities' },
                { label: 'Concierge', icon: 'support_agent', href: '/concierge' },
                { label: 'Transport', icon: 'directions_bus', action: () => setShowTransferModal(true) },
              ].map((action) => (
                <button
                  key={action.label}
                  onClick={() => {
                    if ('action' in action && action.action) action.action();
                    else if ('href' in action) window.location.href = action.href;
                  }}
                  className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/10 hover:border-primary/20 transition-all flex flex-col items-center gap-2 group"
                >
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">{action.icon}</span>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">{action.label}</span>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest rounded-2xl p-8 max-w-md w-full border border-outline-variant/10 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-headline text-primary">Branch Transfer</h3>
              <button onClick={() => setShowTransferModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <p className="text-sm text-on-surface-variant mb-6">
              Your room preferences will be automatically applied at your destination branch.
            </p>

            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">From</label>
                <select
                  value={transferFrom}
                  onChange={(e) => setTransferFrom(e.target.value)}
                  className="w-full bg-surface-container-high border-b-2 border-outline-variant/40 p-3 focus:outline-none focus:border-primary transition-all font-body text-sm rounded-t-lg"
                >
                  <option value="">Select branch</option>
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
                  value={transferTo}
                  onChange={(e) => setTransferTo(e.target.value)}
                  className="w-full bg-surface-container-high border-b-2 border-outline-variant/40 p-3 focus:outline-none focus:border-primary transition-all font-body text-sm rounded-t-lg"
                >
                  <option value="">Select branch</option>
                  {locations.filter((l) => l.slug !== transferFrom).map((l) => (
                    <option key={l.id} value={l.slug}>{l.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-primary-fixed/30 rounded-xl p-4 mb-6">
              <p className="text-xs text-primary font-medium flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">info</span>
                Your preferences (King bed, 22°C, Vegan menu) will be synced to the destination.
              </p>
            </div>

            <button
              onClick={handleTransferRequest}
              disabled={!transferFrom || !transferTo}
              className="w-full bg-primary text-on-primary py-4 rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">directions_bus</span>
              Confirm Transfer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
