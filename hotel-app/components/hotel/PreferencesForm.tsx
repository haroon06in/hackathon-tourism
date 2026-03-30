import React, { useState } from 'react';
import { Preferences } from '../../types/hotel';
import { BookingRequest } from '../../types/booking';
import { useBooking } from '../../hooks/useBooking';

interface PreferencesFormProps {
  hotelId: string;
  roomId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function PreferencesForm({ hotelId, roomId, onSuccess, onCancel }: PreferencesFormProps) {
  const { bookHotel, isSubmitting, error, success } = useBooking();
  
  const [preferences, setPreferences] = useState<Preferences>({
    bedType: 'Queen',
    smoking: false,
    viewPreference: 'None',
    specialRequests: ''
  });

  const [bookingDetails, setBookingDetails] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const req: BookingRequest = {
      hotelId,
      roomId,
      ...bookingDetails,
      preferences
    };

    const isSuccess = await bookHotel(req);
    if (isSuccess) {
      onSuccess();
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {/* Preferences Section */}
      <section className="mb-12 grid grid-cols-1 lg:grid-cols-12 gap-12 bg-surface-container-low p-6 md:p-12 rounded-3xl overflow-hidden relative">
        <div className="lg:col-span-12 z-10 mb-[-1rem]">
          <button type="button" onClick={onCancel} className="text-secondary font-bold text-sm uppercase tracking-widest flex items-center mb-4 hover:opacity-80 transition-opacity">
            <span className="material-symbols-outlined text-[18px] mr-1">arrow_back</span>
            Back to Accommodations
          </button>
        </div>

        <div className="lg:col-span-5 z-10">
          <h2 className="text-3xl font-headline text-primary mb-6">Personalize Your Sanctuary</h2>
          <p className="text-on-surface-variant mb-8 leading-relaxed">
            Tailor your experience to perfection. Our concierge is dedicated to ensuring every detail aligns with your vision of lakeside luxury.
          </p>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-8">
               <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-3">Check In</label>
                <input 
                  type="date"
                  required
                  min={today}
                  value={bookingDetails.checkIn}
                  onChange={e => setBookingDetails({...bookingDetails, checkIn: e.target.value})}
                  className="w-full bg-surface-container-high border-b border-outline/20 py-2 focus:ring-0 focus:border-primary transition-colors font-body text-sm rounded-none border-t-0 border-x-0 outline-none" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-3">Check Out</label>
                <input 
                  type="date"
                  required
                  min={bookingDetails.checkIn || today}
                  value={bookingDetails.checkOut}
                  onChange={e => setBookingDetails({...bookingDetails, checkOut: e.target.value})}
                  className="w-full bg-surface-container-high border-b border-outline/20 py-2 focus:ring-0 focus:border-primary transition-colors font-body text-sm rounded-none border-t-0 border-x-0 outline-none" 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-3">Bed Preference</label>
              <div className="flex gap-4">
                {['King', 'Queen', 'Twin'].map(type => (
                  <label key={type} className="flex items-center cursor-pointer group">
                    <input 
                      type="radio" 
                      name="bed" 
                      className="hidden peer"
                      checked={preferences.bedType === type}
                      onChange={() => setPreferences({...preferences, bedType: type as any})}
                    />
                    <div className="w-5 h-5 rounded-sm border-2 border-outline peer-checked:bg-primary peer-checked:border-primary transition-all"></div>
                    <span className="ml-3 text-sm font-medium">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-3">Smoking</label>
                <select 
                  className="w-full bg-surface-container-high border-b border-outline/20 py-2 focus:ring-0 focus:border-primary transition-colors font-body text-sm border-t-0 border-x-0 outline-none"
                  value={preferences.smoking ? "Smoking" : "Non-smoking"}
                  onChange={e => setPreferences({...preferences, smoking: e.target.value === "Smoking"})}
                >
                  <option value="Non-smoking">Non-smoking</option>
                  <option value="Smoking">Smoking</option>
                </select>
              </div>
              <div>
                 <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-3">View</label>
                <select 
                  className="w-full bg-surface-container-high border-b border-outline/20 py-2 focus:ring-0 focus:border-primary transition-colors font-body text-sm border-t-0 border-x-0 outline-none"
                  value={preferences.viewPreference}
                  onChange={e => setPreferences({...preferences, viewPreference: e.target.value as any})}
                >
                  <option value="None">No Preference</option>
                  <option value="Ocean">Lake / Ocean</option>
                  <option value="Garden">Garden</option>
                  <option value="City">City View</option>
                </select>
              </div>
            </div>
            
             <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-3">Guests</label>
                <input 
                  type="number"
                  required
                  min="1"
                  max="10"
                  value={bookingDetails.guests}
                  onChange={e => setBookingDetails({...bookingDetails, guests: parseInt(e.target.value)})}
                  className="w-full max-w-[100px] bg-surface-container-high border-b border-outline/20 py-2 focus:ring-0 focus:border-primary transition-colors font-body text-sm rounded-none border-t-0 border-x-0 outline-none block" 
                />
              </div>

          </div>
        </div>
        
        <div className="lg:col-span-7 space-y-8 z-10">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-4">Curated Extras</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/15 cursor-pointer hover:border-primary transition-colors group">
                <input type="checkbox" className="w-5 h-5 rounded-sm !text-primary !accent-primary focus:ring-primary border-outline/30 cursor-pointer" />
                <span className="ml-4 text-sm font-medium">Daily Breakfast</span>
              </label>
              <label className="flex items-center p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/15 cursor-pointer hover:border-primary transition-colors group">
                <input type="checkbox" className="w-5 h-5 rounded-sm !text-primary !accent-primary focus:ring-primary border-outline/30 cursor-pointer" />
                <span className="ml-4 text-sm font-medium">Airport Pickup</span>
              </label>
               <label className="flex items-center p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/15 cursor-pointer hover:border-primary transition-colors group">
                <input type="checkbox" className="w-5 h-5 rounded-sm !text-primary !accent-primary focus:ring-primary border-outline/30 cursor-pointer" />
                <span className="ml-4 text-sm font-medium">Late Checkout</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-3">Special Requests</label>
            <textarea 
              className="w-full bg-surface-container-high border-b border-outline/20 p-4 min-h-[120px] focus:ring-0 focus:border-primary transition-colors font-body text-sm rounded-lg border-t-0 border-x-0 outline-none resize-none" 
              placeholder="Tell us about any specific needs or occasions..."
              value={preferences.specialRequests}
              onChange={e => setPreferences({...preferences, specialRequests: e.target.value})}
            />
          </div>
        </div>

        {/* Subtle background texture element */}
        <div className="absolute -bottom-24 -right-24 w-96 h-96 opacity-[0.03] pointer-events-none">
            <span className="material-symbols-outlined text-[300px] text-primary">spa</span>
        </div>
      </section>

      {/* Final Booking Action */}
      <section className="mb-12 flex flex-col items-center">
        {error && (
            <div className="bg-error-container text-on-error-container px-6 py-4 rounded-xl mb-6 font-medium max-w-xl text-center shadow-sm">
                {error}
            </div>
        )}
        <div className="w-full max-w-xl bg-primary-container p-1 rounded-2xl">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-5 bg-primary text-on-primary rounded-xl font-bold text-lg tracking-wide hover:opacity-90 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isSubmitting ? 'Processing...' : 'Confirm Reservation'}
              {!isSubmitting && <span className="material-symbols-outlined">arrow_forward</span>}
            </button>
        </div>
      </section>
    </form>
  );
}
