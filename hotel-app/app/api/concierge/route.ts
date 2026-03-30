import { NextResponse } from 'next/server';
import { SendMessageRequest, ChatMessage } from '../../../types/message';

// Pre-defined set of responses for the mock concierge
const MOCK_RESPONSES = [
  "I'd be happy to help with that!",
  "Absolutely, I can arrange that for you right away.",
  "Let me check our availability for your request.",
  "Certainly! Is there anything else you might need?",
  "I've noted that down on your reservation.",
  "Our front desk will contact you shortly with more details.",
  "That's a wonderful choice. We'll ensure it's prepared perfectly.",
  "Please allow me a moment to look into that for you..."
];

export async function POST(request: Request) {
  try {
    const body: SendMessageRequest = await request.json();
    
    if (!body.text || body.text.trim() === '') {
       return NextResponse.json(
        { error: 'Message text is required' }, 
        { status: 400 }
      );
    }

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Generate a response message
    const responseText = MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
    
    const responseMessage: ChatMessage = {
      id: Date.now().toString() + "-hotel",
      sender: 'hotel',
      text: responseText,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(responseMessage);
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' }, 
      { status: 400 }
    );
  }
}
