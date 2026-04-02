import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function GET() {
  const { data: activities, error } = await supabase
    .from('activities')
    .select('id, name, description, category, price, duration, image_url, time_slots');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Map to match the frontend Activity type
  const mapped = (activities || []).map((a) => ({
    id: a.id,
    name: a.name,
    description: a.description,
    price: a.price,
    image: a.image_url,
    timeSlots: a.time_slots,
    duration: a.duration,
    category: a.category,
  }));

  return NextResponse.json(mapped);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('itinerary')
      .insert({
        profile_id: body.profileId || null,
        type: 'activity',
        activity_id: body.activityId,
        check_in: body.date,
        guests: body.guests || 1,
        notes: body.timeSlot ? `Time slot: ${body.timeSlot}` : null,
      })
      .select('id')
      .single();

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      bookingId: data.id,
      message: 'Activity booked successfully',
    });
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid request body' }, { status: 400 });
  }
}
