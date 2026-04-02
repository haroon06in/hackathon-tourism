"use client";

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Activity } from '../../../types/activity';
import { api } from '../../../lib/api';
import { ActivityCard } from '../../../components/activities/ActivityCard';
import { BookingForm } from '../../../components/activities/BookingForm';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function ActivitiesPage() {
  const { data: activities = [], isLoading: loading, error: queryError } = useQuery({
    queryKey: ['activities'],
    queryFn: api.getActivities,
  });

  const error = queryError ? 'Failed to load experiences. Please try again later.' : null;

  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleBookClick = (activity: Activity) => {
    setSelectedActivity(activity);
    setBookingSuccess(false);
    setTimeout(() => {
        document.getElementById('booking-panel')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleBookingSuccess = () => {
    setBookingSuccess(true);
  };

  const handleCancelBooking = () => {
    setSelectedActivity(null);
    setBookingSuccess(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-primary">
        <Loader2 className="w-12 h-12 animate-spin mb-6" />
        <p className="text-xl font-headline tracking-wider text-on-surface-variant">Curating experiences...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-error-container text-on-error-container p-6 rounded-xl text-center font-medium mt-12 max-w-2xl mx-auto shadow-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 pb-24 animate-in fade-in duration-700 w-full pt-8 md:pt-16">
      {/* Hero Section: Editorial Header */}
      <header className="mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-7">
            <span className="text-secondary font-bold tracking-widest text-[11px] uppercase mb-5 block">
              The Lakeside Curated Living
            </span>
            <h1 className="text-6xl md:text-8xl font-headline text-primary leading-[1.05] tracking-tighter mb-8">
              Curated <br/>Experiences
            </h1>
            <p className="text-on-surface-variant max-w-lg text-lg leading-relaxed font-body">
              Discover the soul of the Rift Valley through our handpicked collection of moments. From silent morning lake ripples to vibrant evenings of Ethiopian heritage.
            </p>
          </div>
          
          <div className="lg:col-span-5 relative">
            <div className="aspect-[4/5] w-full overflow-hidden rounded-[2rem] shadow-2xl relative border border-outline-variant/10">
              <Image 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA12yJoXFd8mUksVXOlqM0Yofgf434C3Qts1RobiWeiQ__F6JNEBbv2GyfuC7NOSZUvWaXzx4FBx_Hgu48dIu1ASOUTk6xWmBG-PCUNxDj_WbwrCa4leKOgDWReNK6CBGV8mbqSTu5PdzW0Lns78GpwSzQW7Wj31Szy9a2fBK-k1V_yqhdSdpWgcuOVuLK6hDITU4srGv2pVQ5tUWOEISYWQeLFD6YsLvP2d4kBQ-rsEYSwfx0VrVxhNmOT3iuMWJilhEFo2--1Iw" 
                alt="Spa setting"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -left-12 bg-surface-container-lowest p-8 rounded-2xl shadow-xl hidden md:block max-w-[280px] border border-outline-variant/5">
              <p className="font-headline italic text-primary text-xl leading-snug">
                "The water speaks a language of calm only the heart understands."
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Activities Grid: Bento Style */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
        {activities.map((activity, index) => (
          <ActivityCard 
            key={activity.id} 
            activity={activity} 
            index={index}
            onBook={handleBookClick} 
          />
        ))}
      </section>

      {/* Dynamic Booking Section */}
      {selectedActivity && !bookingSuccess && (
        <BookingForm 
          activity={selectedActivity} 
          onSuccess={handleBookingSuccess} 
          onCancel={handleCancelBooking}
        />
      )}

      {/* Success State Integration */}
      {bookingSuccess && (
        <div id="booking-panel" className="bg-primary/5 rounded-3xl p-12 text-center max-w-3xl mx-auto shadow-inner border border-primary/20 animate-in zoom-in-95 duration-500">
           <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary text-on-primary mb-8 shadow-xl">
               <span className="material-symbols-outlined text-[48px]">verified</span>
           </div>
           <h2 className="text-4xl font-headline text-primary mb-4">Request Confirmed</h2>
           <p className="text-on-surface-variant text-lg mb-10 leading-relaxed">
             Your itinerary has been seamlessly updated. Our concierge team has been notified and preparation for your <strong>{selectedActivity?.name}</strong> has begun.
           </p>
           <button 
             onClick={handleCancelBooking}
             className="bg-transparent border border-primary text-primary hover:bg-primary hover:text-on-primary px-8 py-4 rounded-xl font-bold transition-all"
           >
             Explore More Experiences
           </button>
        </div>
      )}
    </div>
  );
}
