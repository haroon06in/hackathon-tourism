'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../../lib/api';
import { Activity } from '../../../types/activity';
import { useGuest } from '../../../contexts/GuestContext';

// Simulated upcoming itinerary
const MOCK_ITINERARY = [
  { id: '1', type: 'hotel', title: 'Lakeside Suite Check-in', location: 'Kuriftu Bishoftu', time: '14:00', date: 'Today', status: 'completed', icon: 'hotel' },
  { id: '2', type: 'activity', title: 'Sunset Kayaking', location: 'Lake Kuriftu', time: '16:00', date: 'Today', status: 'upcoming', icon: 'kayaking' },
  { id: '3', type: 'transport', title: 'Shuttle to Entoto', location: 'Kuriftu Entoto', time: '09:00', date: 'Tomorrow', status: 'scheduled', icon: 'directions_bus' },
  { id: '4', type: 'activity', title: 'Zipline Adventure', location: 'Entoto Mountains', time: '11:00', date: 'Tomorrow', status: 'scheduled', icon: 'paragliding' },
  { id: '5', type: 'hotel', title: 'Highland Suite Check-in', location: 'Kuriftu Entoto', time: '15:00', date: 'Tomorrow', status: 'scheduled', icon: 'hotel' },
];

const CATEGORY_ICONS: Record<string, string> = {
  wellness: 'spa', adventure: 'hiking', heritage: 'church', discovery: 'explore', family: 'family_restroom', dining: 'restaurant',
};

export default function DashboardPage() {
  const { guest, isLoading: guestLoading } = useGuest();
  const router = useRouter();

  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    if (!guestLoading && !guest) {
      router.push('/login');
    }
  }, [guest, guestLoading, router]);

  const prefs = (guest?.preferences || {}) as Record<string, unknown>;

  // Fetch activities filtered by persona for AI suggestions
  const { data: suggestedActivities = [] } = useQuery<Activity[]>({
    queryKey: ['activities'],
    queryFn: api.getActivities,
  });

  useEffect(() => {
    const update = () => setCurrentTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  // Map persona to relevant activity categories
  const personaCategoryMap: Record<string, string[]> = {
    adventurous: ['adventure', 'discovery'],
    relaxed: ['wellness'],
    cultural: ['heritage', 'discovery'],
    family: ['family', 'discovery'],
    wellness: ['wellness'],
  };
  const relevantCategories = personaCategoryMap[guest?.persona || 'relaxed'] || ['discovery'];
  const aiSuggestions = suggestedActivities
    .filter((a) => relevantCategories.includes(a.category))
    .slice(0, 3);

  if (guestLoading || !guest) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 pb-24 pt-8 md:pt-12 animate-in fade-in duration-500 w-full">
      {/* Header */}
      <header className="mb-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <span className="text-secondary font-bold tracking-widest text-[11px] uppercase mb-2 block">Guest Dashboard</span>
            <h1 className="text-4xl md:text-5xl font-headline text-primary tracking-tight">
              Welcome, {guest?.full_name?.split(' ')[0] || 'Guest'}
            </h1>
            <p className="text-on-surface-variant mt-2">
              Currently at <strong className="text-primary">Kuriftu Bishoftu</strong> · {currentTime}
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/transfer"
              className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all active:scale-95 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">swap_horiz</span>
              Request Transfer
            </Link>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Current Branch', value: 'Bishoftu', icon: 'location_on', color: 'bg-primary-fixed text-primary' },
            { label: 'Room Temp', value: `${prefs.room_temp || 22}°C`, icon: 'thermostat', color: 'bg-secondary-container text-on-secondary-container' },
            { label: 'Next Activity', value: '4:00 PM', icon: 'schedule', color: 'bg-tertiary-container text-on-tertiary-container' },
            { label: 'Persona', value: guest?.persona || 'relaxed', icon: 'person', color: 'bg-surface-container text-on-surface' },
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
              {aiSuggestions.length === 0 && (
                <p className="text-sm text-on-surface-variant">Loading suggestions...</p>
              )}
              {aiSuggestions.map((activity) => (
                <Link key={activity.id} href="/activities">
                  <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/10 hover:border-primary/20 transition-all cursor-pointer group">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary-fixed text-primary rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-[20px]">{CATEGORY_ICONS[activity.category] || 'explore'}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-on-surface text-sm">{activity.name}</p>
                        <p className="text-xs text-on-surface-variant mt-0.5">Recommended for your {guest?.persona} persona</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs font-bold text-primary">${activity.price}</span>
                          <span className="text-[10px] text-on-surface-variant">{activity.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Room Preferences */}
          <section>
            <h3 className="text-lg font-headline text-primary mb-4">Room Preferences</h3>
            <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/10 space-y-4">
              {[
                { label: 'Bed Type', value: String(prefs.bed_type || 'King'), icon: 'bed' },
                { label: 'Room Temperature', value: `${prefs.room_temp || 22}°C`, icon: 'thermostat' },
                { label: 'Dietary', value: String(prefs.dietary || 'None'), icon: 'restaurant' },
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
                { label: 'Transport', icon: 'directions_bus', href: '/transfer' },
              ].map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/10 hover:border-primary/20 transition-all flex flex-col items-center gap-2 group"
                >
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">{action.icon}</span>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">{action.label}</span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>

    </div>
  );
}
