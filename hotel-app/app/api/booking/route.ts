import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';
import { BookingRequest } from '../../../types/booking';

export async function POST(request: Request) {
  try {
    const body: BookingRequest = await request.json();

    if (!body.hotelId || !body.roomId || !body.checkIn || !body.checkOut) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get the hotel's location_id
    const { data: hotel } = await supabase
      .from('hotels')
      .select('location_id')
      .eq('id', body.hotelId)
      .single();

    const { data, error } = await supabase
      .from('itinerary')
      .insert({
        profile_id: null,
        type: 'hotel',
        hotel_id: body.hotelId,
        room_type_id: body.roomId,
        location_id: hotel?.location_id || null,
        check_in: body.checkIn,
        check_out: body.checkOut,
        guests: body.guests || 1,
        notes: body.preferences ? JSON.stringify(body.preferences) : null,
      })
      .select('id')
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      bookingId: data.id,
      message: 'Booking confirmed successfully!',
    });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid request body' },
      { status: 400 }
    );
  }
}
