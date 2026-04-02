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
