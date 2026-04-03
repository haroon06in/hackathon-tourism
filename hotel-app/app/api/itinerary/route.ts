import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const profileId = searchParams.get('profileId');

  if (!profileId) {
    return NextResponse.json({ error: 'profileId query param required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('itinerary')
    .select(`
      id, type, check_in, check_out, guests, status, notes, created_at,
      hotels ( name, image_url ),
      room_types ( name, price ),
      activities ( name, price, duration, category ),
      locations ( name, slug )
    `)
    .eq('profile_id', profileId)
    .order('check_in', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: 'id required' }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};
    if (body.status) updates.status = body.status;
    if (body.check_in) updates.check_in = body.check_in;
    if (body.check_out) updates.check_out = body.check_out;
    if (body.guests) updates.guests = body.guests;
    if (body.notes !== undefined) updates.notes = body.notes;

    const { data, error } = await supabase
      .from('itinerary')
      .update(updates)
      .eq('id', body.id)
      .select('id, status')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'id query param required' }, { status: 400 });
  }

  const { error } = await supabase
    .from('itinerary')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
