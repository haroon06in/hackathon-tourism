import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.fromLocationId || !body.toLocationId) {
      return NextResponse.json({ error: 'fromLocationId and toLocationId required' }, { status: 400 });
    }

    // Get destination location for the transfer
    const { data: toLoc } = await supabase
      .from('locations')
      .select('name')
      .eq('id', body.toLocationId)
      .single();

    // Create transport itinerary entry
    const { data, error } = await supabase
      .from('itinerary')
      .insert({
        profile_id: body.profileId || null,
        type: 'transport',
        location_id: body.toLocationId,
        check_in: body.departureTime || new Date().toISOString(),
        guests: body.guests || 1,
        status: 'confirmed',
        notes: JSON.stringify({
          fromLocationId: body.fromLocationId,
          toLocationId: body.toLocationId,
          roomPreferences: body.roomPreferences || {},
        }),
      })
      .select('id')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      transferId: data.id,
      message: `Transfer to ${toLoc?.name || 'destination'} confirmed`,
      driver: {
        name: 'Abebe Kebede',
        phone: '+251 91 234 5678',
        vehicle: 'Toyota HiAce',
        plate: 'AA-3-14159',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
