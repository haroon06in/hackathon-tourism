"use client";

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Hotel, RoomType } from '../../../types/hotel';
import { api } from '../../../lib/api';
import { RoomCard } from '../../../components/hotel/RoomCard';
import { PreferencesForm } from '../../../components/hotel/PreferencesForm';
import { Loader2 } from 'lucide-react';
import { useGuest } from '../../../contexts/GuestContext';

export default function HotelsPage() {
  const { guest, isLoading: guestLoading } = useGuest();
  const router = useRouter();

  useEffect(() => {
    if (!guestLoading && !guest) router.push('/login');
  }, [guest, guestLoading, router]);
  const { data: hotels = [], isLoading: loading, error: queryError } = useQuery({
    queryKey: ['hotels'],
    queryFn: api.getHotels,
  });

  const error = queryError ? 'Failed to load locations. Please try again later.' : null;

  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Auto-select first hotel once data loads
  if (hotels.length > 0 && !selectedHotel) {
    setSelectedHotel(hotels[0]);
  }

  const handleBookRoom = (room: RoomType) => {
    setSelectedRoom(room);
    setBookingSuccess(false);
    
    // smooth scroll to preferences section ideally, or just rely on natural layout
    setTimeout(() => {
        document.getElementById('preferences-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleBookingSuccess = () => {
    setBookingSuccess(true);
  };

  const resetBooking = () => {
    setBookingSuccess(false);
    setSelectedRoom(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-primary">
        <Loader2 className="w-10 h-10 animate-spin mb-4" />
        <p className="text-lg font-medium text-on-surface-variant">Loading curated destinations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-error-container text-on-error-container p-6 rounded-xl text-center font-medium mt-12 max-w-2xl mx-auto">
        {error}
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 pb-20 max-w-7xl mx-auto w-full">
      {/* Hero Section: Location Selection */}
      <header className="py-12 md:py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-headline tracking-tight text-primary mb-6">The Lakeside Curated Living</h1>
        <p className="max-w-2xl mx-auto text-on-surface-variant font-body leading-relaxed mb-10">
          Immerse yourself in the rhythmic beauty of Ethiopia's Rift Valley. Select your sanctuary along the shores of ancient lakes.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {hotels.map(hotel => (
            <button 
              key={hotel.id}
              onClick={() => {
                setSelectedHotel(hotel);
                setSelectedRoom(null);
                setBookingSuccess(false);
              }}
              className={`flex items-center gap-3 px-8 py-4 bg-surface-container-lowest rounded-xl editorial-shadow transition-all group border border-outline-variant/15 ${selectedHotel?.id === hotel.id ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-surface-container-high'}`}
            >
              <span className="material-symbols-outlined text-secondary">
                {hotel.name.includes('Bishoftu') ? 'location_on' : 'waves'}
              </span>
              <div className="text-left leading-tight">
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">Resort</p>
                <p className="font-headline text-lg">{hotel.name}</p>
              </div>
            </button>
          ))}
        </div>
      </header>

      {/* Room Selection Section */}
      {selectedHotel && (
        <section className="mb-20 animate-in slide-in-from-bottom-8 duration-700">
          <div className="flex items-end justify-between mb-10">
            <h2 className="text-3xl font-headline text-primary">Signature Accommodations</h2>
            <div className="hidden md:block h-px flex-1 mx-8 bg-outline-variant/20"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {selectedHotel.roomTypes.map((room, idx) => (
              <RoomCard 
                key={room.id} 
                room={room} 
                onBook={handleBookRoom} 
                isPopular={idx === 1} // just mock the second one as popular like the design
              />
            ))}
          </div>
        </section>
      )}

      {/* Preferences Section (Only visible after clicking Select Room) */}
      <div id="preferences-section" className="scroll-mt-32">
        {selectedRoom && !bookingSuccess && (
          <div className="animate-in zoom-in-95 duration-500">
             <div className="flex items-center mb-6 px-4">
               <span className="bg-primary text-on-primary px-3 py-1 rounded-full text-sm font-bold tracking-wider uppercase mr-3 shadow-md">
                 Selected
               </span>
               <h3 className="text-xl font-headline text-primary">{selectedRoom.name}</h3>
             </div>
             
             {selectedHotel && (
               <PreferencesForm 
                 hotelId={selectedHotel?.id}
                 roomId={selectedRoom.id}
                 onSuccess={handleBookingSuccess}
                 onCancel={resetBooking}
               />
             )}
          </div>
        )}

        {/* Success State */}
        {bookingSuccess && (
          <section className="mb-24 flex flex-col items-center animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 bg-primary-fixed text-primary rounded-full flex items-center justify-center mb-8 shadow-sm">
                <span className="material-symbols-outlined text-[48px]">check_circle</span>
            </div>
            <h2 className="text-3xl font-headline text-primary mb-4 text-center">Reservation Complete</h2>
            <p className="text-on-surface-variant text-center max-w-lg mb-8 leading-relaxed">
              Your preferences have been saved and your stay at <strong>{selectedHotel?.name}</strong> is confirmed. 
              We look forward to welcoming you to the shores of tranquility.
            </p>
            <div className="w-full max-w-xl bg-surface-container-low p-1 rounded-2xl border border-outline-variant/20 shadow-sm">
                <button 
                  onClick={resetBooking}
                  className="w-full py-4 bg-transparent text-primary rounded-xl font-bold tracking-wide hover:bg-surface-container-high transition-all flex items-center justify-center"
                >
                    View Other Accommodations
                </button>
            </div>
            <p className="mt-8 text-sm text-on-surface-variant italic">
                “Your stay at Kuriftu has been successfully booked.”
            </p>
          </section>
        )}
      </div>

    </div>
  );
}
