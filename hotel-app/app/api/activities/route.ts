import { NextResponse } from 'next/server';
import { mockActivities } from '../../../lib/mockData';

export async function GET() {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return NextResponse.json(mockActivities);
}

// Optionally implement POST for booking activity here or just use /api/booking
export async function POST(request: Request) {
  try {
    // Simple mock logic
    await request.json();
    await new Promise(resolve => setTimeout(resolve, 1000));
    return NextResponse.json({
      success: true,
      message: 'Activity booked successfully'
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Error booking' }, { status: 400 });
  }
}
