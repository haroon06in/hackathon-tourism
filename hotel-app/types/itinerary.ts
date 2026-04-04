export interface ItineraryItem {
  id: string;
  type: 'hotel' | 'activity' | 'transport';
  check_in: string | null;
  check_out: string | null;
  guests: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes: string | null;
  created_at: string;
  hotels: { name: string; image_url: string } | null;
  room_types: { name: string; price: number } | null;
  activities: { name: string; price: number; duration: string; category: string } | null;
  locations: { name: string; slug: string } | null;
}
