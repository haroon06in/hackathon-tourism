import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function GET() {
  const { data: hotels, error } = await supabase
    .from('hotels')
    .select(`
      id,
      name,
      description,
      rating,
      image_url,
      locations!inner ( name ),
      room_types ( id, name, price, capacity, amenities, image_url )
    `);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Map to match the frontend Hotel type
  const mapped = (hotels || []).map((h: Record<string, unknown>) => {
    const loc = h.locations as Record<string, unknown> | null;
    const rooms = h.room_types as Record<string, unknown>[] | null;
    return {
      id: h.id,
      name: h.name,
      location: loc?.name || '',
      rating: h.rating,
      description: h.description,
      image: h.image_url,
      roomTypes: (rooms || []).map((r) => ({
        id: r.id,
        name: r.name,
        price: r.price,
        capacity: r.capacity,
        amenities: r.amenities,
        image: r.image_url,
      })),
    };
  });

  return NextResponse.json(mapped);
}
