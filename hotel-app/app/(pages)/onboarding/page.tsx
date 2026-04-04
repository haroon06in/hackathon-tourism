'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useGuest } from '../../../contexts/GuestContext';
import { api } from '../../../lib/api';
import { Profile } from '../../../types/profile';
import { Hotel } from '../../../types/hotel';
import { Activity } from '../../../types/activity';

const PERSONAS = [
  { id: 'adventurous', label: 'The Explorer', icon: 'hiking', desc: 'Ziplines, trails, and sunrise kayaking' },
  { id: 'relaxed', label: 'The Relaxer', icon: 'self_improvement', desc: 'Poolside, spa days, and slow mornings' },
  { id: 'cultural', label: 'The Culture Seeker', icon: 'museum', desc: 'Monasteries, coffee ceremonies, and local art' },
  { id: 'family', label: 'The Family', icon: 'family_restroom', desc: 'Kid-friendly activities and shared adventures' },
  { id: 'wellness', label: 'The Wellness Devotee', icon: 'spa', desc: 'Yoga, meditation, and healing rituals' },
] as const;

const DIETARY_OPTIONS = ['None', 'Vegan', 'Vegetarian', 'Halal', 'Gluten-free', 'Other'];

const CATEGORY_ICONS: Record<string, string> = {
  wellness: 'spa', adventure: 'hiking', heritage: 'church', discovery: 'explore', family: 'family_restroom', dining: 'restaurant',
};

const TOTAL_STEPS = 5;

export default function OnboardingPageWrapper() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span></div>}>
      <OnboardingPage />
    </Suspense>
  );
}

function OnboardingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { updateGuest } = useGuest();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedProfile, setSavedProfile] = useState<Profile | null>(null);

  // Step 1
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [phone, setPhone] = useState('');

  // Step 2
  const [persona, setPersona] = useState<string>('');

  // Step 3
  const [dietary, setDietary] = useState('None');
  const [bedType, setBedType] = useState('King');
  const [roomTemp, setRoomTemp] = useState(22);
  const [specialRequests, setSpecialRequests] = useState('');

  // Step 4 — Itinerary planning
  const [selectedHotelId, setSelectedHotelId] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [selectedActivities, setSelectedActivities] = useState<Set<string>>(new Set());

  const { data: hotels = [] } = useQuery<Hotel[]>({
    queryKey: ['hotels'],
    queryFn: api.getHotels,
    enabled: step >= 4,
  });

  const { data: activities = [] } = useQuery<Activity[]>({
    queryKey: ['activities'],
    queryFn: api.getActivities,
    enabled: step >= 4,
  });

  const today = new Date().toISOString().split('T')[0];
  const selectedHotel = hotels.find((h) => h.id === selectedHotelId);

  // Save profile after step 3
  const handleSaveProfile = async () => {
    setIsSubmitting(true);
    try {
      const profile = await api.createProfile({
        fullName,
        email,
        phone: phone || undefined,
        persona: persona as Profile['persona'],
        preferences: {
          dietary,
          bed_type: bedType,
          room_temp: roomTemp,
          special_requests: specialRequests,
        },
      });
      setSavedProfile(profile);
      updateGuest(profile);
      setStep(4);
    } catch (err) {
      console.error('Failed to create profile:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Book selected items from step 4
  const handleBookItinerary = async () => {
    setIsSubmitting(true);
    try {
      // Book hotel if selected
      if (selectedHotelId && selectedRoomId && checkIn && checkOut) {
        await api.submitBooking({
          hotelId: selectedHotelId,
          roomId: selectedRoomId,
          checkIn,
          checkOut,
          guests: 1,
          preferences: { bedType: bedType as 'King' | 'Queen' | 'Single' | 'Double', smoking: false, viewPreference: 'None', specialRequests },
          profileId: savedProfile?.id,
        });
      }

      // Book selected activities
      for (const actId of selectedActivities) {
        const act = activities.find((a) => a.id === actId);
        if (act) {
          await api.submitActivityBooking({
            activityId: actId,
            date: checkIn || today,
            timeSlot: act.timeSlots[0] || '',
            guests: 1,
            profileId: savedProfile?.id,
          });
        }
      }

      setStep(5);
    } catch (err) {
      console.error('Failed to book itinerary:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleActivity = (id: string) => {
    setSelectedActivities((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl">
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                s === step ? 'w-10 bg-primary' :
                s < step ? 'w-6 bg-primary/40' :
                'w-6 bg-outline-variant/20'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-headline text-primary mb-3">Let&apos;s Get Acquainted</h1>
              <p className="text-on-surface-variant">Tell us a bit about yourself so we can personalize your stay.</p>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/10 space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">Full Name</label>
                <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Liya Tadesse"
                  className="w-full bg-surface-container-high border-b-2 border-outline-variant/40 p-4 focus:outline-none focus:border-primary transition-all font-body text-sm rounded-t-lg" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">Email</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                  className="w-full bg-surface-container-high border-b-2 border-outline-variant/40 p-4 focus:outline-none focus:border-primary transition-all font-body text-sm rounded-t-lg" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">Phone (Optional)</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+251 91 234 5678"
                  className="w-full bg-surface-container-high border-b-2 border-outline-variant/40 p-4 focus:outline-none focus:border-primary transition-all font-body text-sm rounded-t-lg" />
              </div>
            </div>

            <button onClick={() => setStep(2)} disabled={!fullName || !email}
              className="w-full mt-8 bg-gradient-to-r from-primary to-primary-container text-on-primary py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              Continue <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
          </div>
        )}

        {/* Step 2: Persona Selection */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-headline text-primary mb-3">Your Travel Persona</h1>
              <p className="text-on-surface-variant">Choose the style that best describes your ideal getaway.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PERSONAS.map((p) => (
                <button key={p.id} onClick={() => setPersona(p.id)}
                  className={`p-6 rounded-2xl text-left transition-all border ${persona === p.id ? 'bg-primary-fixed/20 border-primary shadow-sm' : 'bg-surface-container-lowest border-outline-variant/10 hover:border-primary/30'}`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${persona === p.id ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'}`}>
                    <span className="material-symbols-outlined">{p.icon}</span>
                  </div>
                  <p className="font-headline text-lg text-primary mb-1">{p.label}</p>
                  <p className="text-sm text-on-surface-variant">{p.desc}</p>
                </button>
              ))}
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={() => setStep(1)} className="px-6 py-4 rounded-xl font-bold text-on-surface-variant hover:bg-surface-container transition-all">Back</button>
              <button onClick={() => setStep(3)} disabled={!persona}
                className="flex-1 bg-gradient-to-r from-primary to-primary-container text-on-primary py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                Continue <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Preferences */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-headline text-primary mb-3">Your Preferences</h1>
              <p className="text-on-surface-variant">Fine-tune your experience. These sync across all Kuriftu branches.</p>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/10 space-y-8">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-3">Dietary Preference</label>
                <select value={dietary} onChange={(e) => setDietary(e.target.value)}
                  className="w-full bg-surface-container-high border-b-2 border-outline-variant/40 p-4 focus:outline-none focus:border-primary transition-all font-body text-sm rounded-t-lg">
                  {DIETARY_OPTIONS.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-3">Bed Preference</label>
                <div className="flex gap-4">
                  {['King', 'Queen', 'Twin'].map((type) => (
                    <label key={type} className="flex items-center cursor-pointer">
                      <input type="radio" name="bed" className="hidden peer" checked={bedType === type} onChange={() => setBedType(type)} />
                      <div className="w-5 h-5 rounded-sm border-2 border-outline peer-checked:bg-primary peer-checked:border-primary transition-all" />
                      <span className="ml-3 text-sm font-medium">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-3">Room Temperature: {roomTemp}°C</label>
                <input type="range" min={18} max={28} value={roomTemp} onChange={(e) => setRoomTemp(Number(e.target.value))} className="w-full accent-primary" />
                <div className="flex justify-between text-[10px] text-on-surface-variant uppercase tracking-widest font-bold mt-1">
                  <span>18°C</span><span>28°C</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-3">Special Requests</label>
                <textarea value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} placeholder="Any specific needs or occasions..."
                  className="w-full bg-surface-container-high border-b-2 border-outline-variant/40 p-4 min-h-[100px] focus:outline-none focus:border-primary transition-all font-body text-sm rounded-t-lg resize-none" />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={() => setStep(2)} className="px-6 py-4 rounded-xl font-bold text-on-surface-variant hover:bg-surface-container transition-all">Back</button>
              <button onClick={handleSaveProfile} disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-primary to-primary-container text-on-primary py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all active:scale-95 disabled:opacity-40 flex items-center justify-center gap-2">
                {isSubmitting ? (<><span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>Saving...</>) : (<>Continue <span className="material-symbols-outlined text-[20px]">arrow_forward</span></>)}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Itinerary Planning (Skippable) */}
        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-headline text-primary mb-3">Plan Your Stay</h1>
              <p className="text-on-surface-variant">Book your first hotel and pick some activities. You can always change these later.</p>
            </div>

            {/* Hotel selection */}
            <div className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/10 space-y-6 mb-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-secondary">Choose a Hotel</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {hotels.map((h) => (
                  <button key={h.id} onClick={() => { setSelectedHotelId(h.id); setSelectedRoomId(h.roomTypes[0]?.id || ''); }}
                    className={`p-4 rounded-xl text-left transition-all border ${selectedHotelId === h.id ? 'bg-primary-fixed/20 border-primary' : 'border-outline-variant/10 hover:border-primary/30'}`}>
                    <p className="font-bold text-on-surface text-sm">{h.name}</p>
                    <p className="text-xs text-on-surface-variant mt-1">{h.location}</p>
                    <p className="text-xs font-bold text-primary mt-2">From ${h.roomTypes[0]?.price || 0}/night</p>
                  </button>
                ))}
              </div>

              {selectedHotel && (
                <>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-secondary mt-4">Room Type</h3>
                  <div className="flex gap-3 flex-wrap">
                    {selectedHotel.roomTypes.map((r) => (
                      <button key={r.id} onClick={() => setSelectedRoomId(r.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${selectedRoomId === r.id ? 'bg-primary text-on-primary border-primary' : 'border-outline-variant/20 hover:border-primary/30'}`}>
                        {r.name} · ${r.price}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">Check In</label>
                      <input type="date" min={today} value={checkIn} onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full bg-surface-container-high border-b-2 border-outline-variant/40 p-3 focus:outline-none focus:border-primary transition-all font-body text-sm rounded-t-lg" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">Check Out</label>
                      <input type="date" min={checkIn || today} value={checkOut} onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full bg-surface-container-high border-b-2 border-outline-variant/40 p-3 focus:outline-none focus:border-primary transition-all font-body text-sm rounded-t-lg" />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Activity selection */}
            <div className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/10 space-y-4 mb-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-secondary">Add Activities</h3>
              <div className="space-y-2">
                {activities.map((a) => (
                  <button key={a.id} onClick={() => toggleActivity(a.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all border ${selectedActivities.has(a.id) ? 'bg-primary-fixed/20 border-primary' : 'border-outline-variant/10 hover:border-primary/30'}`}>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${selectedActivities.has(a.id) ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'}`}>
                      <span className="material-symbols-outlined text-[20px]">{CATEGORY_ICONS[a.category] || 'explore'}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-on-surface text-sm">{a.name}</p>
                      <p className="text-xs text-on-surface-variant">{a.duration} · ${a.price}</p>
                    </div>
                    {selectedActivities.has(a.id) && (
                      <span className="material-symbols-outlined text-primary">check_circle</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(5)}
                className="px-6 py-4 rounded-xl font-bold text-on-surface-variant hover:bg-surface-container transition-all">
                Skip for Now
              </button>
              <button onClick={handleBookItinerary} disabled={isSubmitting || (!selectedHotelId && selectedActivities.size === 0)}
                className="flex-1 bg-gradient-to-r from-primary to-primary-container text-on-primary py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all active:scale-95 disabled:opacity-40 flex items-center justify-center gap-2">
                {isSubmitting ? (<><span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>Booking...</>) : (<>Book & Continue <span className="material-symbols-outlined text-[20px]">arrow_forward</span></>)}
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Welcome */}
        {step === 5 && (
          <div className="animate-in fade-in zoom-in-95 duration-500 text-center">
            <div className="w-24 h-24 bg-primary text-on-primary rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
              <span className="material-symbols-outlined text-[48px]">celebration</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-headline text-primary mb-4">
              Welcome to Kuriftu, {fullName.split(' ')[0]}!
            </h1>
            <p className="text-on-surface-variant text-lg mb-3 max-w-md mx-auto leading-relaxed">
              Your profile is set and your preferences will follow you across all Kuriftu branches.
            </p>

            <div className="inline-flex items-center gap-3 bg-primary-fixed/20 px-6 py-3 rounded-full mb-10">
              <span className="material-symbols-outlined text-primary">
                {PERSONAS.find((p) => p.id === persona)?.icon}
              </span>
              <span className="font-bold text-primary">
                {PERSONAS.find((p) => p.id === persona)?.label}
              </span>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/10 mb-10 max-w-sm mx-auto">
              <p className="text-sm text-on-surface-variant mb-2">
                <span className="material-symbols-outlined text-[16px] align-middle mr-1">auto_awesome</span>
                Aura, your AI concierge, is now personalized to your preferences and ready to help.
              </p>
            </div>

            <button onClick={() => router.push('/dashboard')}
              className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-10 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all active:scale-95 inline-flex items-center gap-2">
              Go to Dashboard <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
