import React, { useState } from 'react';
import { Activity, ActivityBookingRequest } from '../../types/activity';
import { useBooking } from '../../hooks/useBooking';
import { useGuest } from '../../contexts/GuestContext';

interface BookingFormProps {
  activity: Activity;
  onSuccess: () => void;
  onCancel: () => void;
}

export function BookingForm({ activity, onSuccess, onCancel }: BookingFormProps) {
  const { bookActivity, isSubmitting, error, success } = useBooking();
  const { guest } = useGuest();
  
  const [bookingDetails, setBookingDetails] = useState({
    date: '',
    timeSlot: activity.timeSlots[0] || '',
    guests: 1
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const req: ActivityBookingRequest = {
      activityId: activity.id,
      ...bookingDetails,
      profileId: guest?.id,
    };

    const isSuccess = await bookActivity(req);
    if (isSuccess) {
      onSuccess();
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <section className="bg-surface-container rounded-3xl p-8 md:p-16 relative overflow-hidden shadow-inner border border-outline-variant/10 animate-in slide-in-from-bottom-8 duration-700" id="booking-panel">
      {/* Background radial gradient decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary-container/30 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
      
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        
        {/* Left Side Info */}
        <div className="flex flex-col">
          <button 
            type="button" 
            onClick={onCancel} 
            className="text-secondary font-bold text-xs uppercase tracking-widest flex items-center mb-8 hover:opacity-80 transition-opacity self-start"
          >
            <span className="material-symbols-outlined text-[16px] mr-1">arrow_back</span>
            Back to Capabilities
          </button>

          <h2 className="text-4xl lg:text-5xl font-headline text-primary mb-6">Reserve Your Moment</h2>
          <p className="text-on-surface-variant mb-12 text-lg leading-relaxed max-w-md">
            Select your preferred date and time for <strong className="text-primary">{activity.name}</strong>. Our concierge team will ensure every detail is meticulously prepared for your arrival.
          </p>
          
          <div className="space-y-8 mt-auto">
            <div className="flex items-start gap-6">
              <div className="bg-surface-container-lowest p-3 rounded-full text-secondary shadow-sm mt-1">
                <span className="material-symbols-outlined text-[24px]">event_available</span>
              </div>
              <div>
                <h4 className="font-bold text-primary mb-1 text-lg">Flexible Scheduling</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed">Reschedule up to 24 hours in advance at no extra cost.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-6">
              <div className="bg-surface-container-lowest p-3 rounded-full text-secondary shadow-sm mt-1">
                <span className="material-symbols-outlined text-[24px]">verified_user</span>
              </div>
              <div>
                <h4 className="font-bold text-primary mb-1 text-lg">Premium Safety</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed">All activities are guided by certified resort professionals.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Side Form */}
        <div className="bg-surface-container-lowest p-8 md:p-10 rounded-2xl shadow-md border border-outline-variant/15 md:-my-4">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-6 mb-2">
                <div>
                   <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1 block">Selected Request</span>
                   <h3 className="font-headline text-2xl text-primary">{activity.name}</h3>
                </div>
                <div className="text-right">
                    <span className="text-2xl font-bold text-secondary flex items-baseline justify-end">
                        ${activity.price}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Per Guest</span>
                </div>
            </div>

            {error && (
              <div className="bg-error-container text-on-error-container p-4 rounded-xl text-sm font-medium border border-error/20 flex items-center gap-3">
                 <span className="material-symbols-outlined text-[20px]">error</span>
                 {error}
              </div>
            )}

            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-widest text-secondary ml-1">Date of Activity</label>
              <input 
                type="date"
                required
                min={today}
                value={bookingDetails.date}
                onChange={e => setBookingDetails({...bookingDetails, date: e.target.value})}
                className="w-full bg-surface-container-high border-b-2 border-outline-variant/40 p-4 focus:outline-none focus:bg-surface-container-lowest focus:border-primary transition-all font-body text-sm rounded-t-lg" 
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-widest text-secondary ml-1">Time slot</label>
                <select 
                  required
                  value={bookingDetails.timeSlot}
                  onChange={e => setBookingDetails({...bookingDetails, timeSlot: e.target.value})}
                  className="w-full bg-surface-container-high border-b-2 border-outline-variant/40 p-4 focus:outline-none focus:bg-surface-container-lowest focus:border-primary transition-all font-body text-sm rounded-t-lg"
                >
                  {activity.timeSlots.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-widest text-secondary ml-1">Guest count</label>
                <input 
                  type="number"
                  required
                  min="1"
                  max="10"
                  value={bookingDetails.guests}
                  onChange={e => setBookingDetails({...bookingDetails, guests: parseInt(e.target.value)})}
                  className="w-full bg-surface-container-high border-b-2 border-outline-variant/40 p-4 focus:outline-none focus:bg-surface-container-lowest focus:border-primary transition-all font-body text-sm rounded-t-lg" 
                />
              </div>
            </div>

            <div className="pt-8">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-primary text-on-primary py-5 rounded-xl font-bold text-lg hover:bg-primary-container transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isSubmitting ? 'Processing...' : 'Complete Reservation'}
                {!isSubmitting && <span className="material-symbols-outlined text-[20px]">assignment_turned_in</span>}
              </button>
            </div>
            
            <p className="text-center text-xs text-on-surface-variant italic mt-6">
                No charges will be applied until your stay balance is finalized.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
