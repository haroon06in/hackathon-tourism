import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { SendMessageRequest, ChatMessage } from '../../../types/message';
import { supabase } from '../../../lib/supabase';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_PROMPT = `You are Aura, the AI concierge for Kuriftu Resorts & Spa in Ethiopia. You help guests with:
- Activity recommendations based on their preferences and current location
- Restaurant and dining suggestions (including dietary accommodations)
- Room service requests and contextual suggestions
- Transport coordination between Kuriftu branches (the "Kuriftu Loop": Bishoftu, Entoto, Lake Tana, Awash)
- Local tips and cultural experiences

Personality: Warm, knowledgeable, concise. You speak like a trusted local friend, not a corporate chatbot.
Keep responses under 3 sentences unless the guest asks for detail.
Always reference specific Kuriftu locations and real Ethiopian culture when relevant.
If you don't know something specific, say so honestly and offer to connect them with the front desk.`;

async function getLocationContext(slug?: string) {
  if (!slug) return '';

  const { data: location } = await supabase
    .from('locations')
    .select('name, description, amenities, menu')
    .eq('slug', slug)
    .single();

  if (!location) return '';

  const { data: activities } = await supabase
    .from('activities')
    .select('name, category, price, duration, time_slots')
    .eq('location_id', (
      await supabase.from('locations').select('id').eq('slug', slug).single()
    ).data?.id);

  return `\n\nCurrent location: ${location.name}
Description: ${location.description}
Amenities: ${JSON.stringify(location.amenities)}
${location.menu ? `Menu: ${JSON.stringify(location.menu)}` : ''}
${activities ? `Available activities: ${JSON.stringify(activities)}` : ''}`;
}

function buildGuestContext(profile?: SendMessageRequest['guestProfile']) {
  if (!profile) return '';
  const parts = [];
  if (profile.name) parts.push(`Guest name: ${profile.name}`);
  if (profile.persona) parts.push(`Persona: ${profile.persona}`);
  if (profile.preferences) parts.push(`Preferences: ${JSON.stringify(profile.preferences)}`);
  return parts.length ? `\n\nGuest profile:\n${parts.join('\n')}` : '';
}

export async function POST(request: Request) {
  try {
    const body: SendMessageRequest = await request.json();

    if (!body.text || body.text.trim() === '') {
      return NextResponse.json(
        { error: 'Message text is required' },
        { status: 400 }
      );
    }

    const [locationContext, guestContext] = await Promise.all([
      getLocationContext(body.locationSlug),
      Promise.resolve(buildGuestContext(body.guestProfile)),
    ]);

    const fullSystemPrompt = SYSTEM_PROMPT + guestContext + locationContext;

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: { parts: [{ text: fullSystemPrompt }] },
    });

    const history = (body.history || []).map((msg) => ({
      role: msg.sender === 'user' ? 'user' as const : 'model' as const,
      parts: [{ text: msg.text }],
    }));

    const chat = model.startChat({ history });

    const result = await chat.sendMessage(body.text);
    const responseText = result.response.text();

    const responseMessage: ChatMessage = {
      id: Date.now().toString() + '-hotel',
      sender: 'hotel',
      text: responseText,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(responseMessage);
  } catch (error) {
    console.error('Concierge error:', error);
    return NextResponse.json(
      { error: 'Failed to get response from concierge' },
      { status: 500 }
    );
  }
}
