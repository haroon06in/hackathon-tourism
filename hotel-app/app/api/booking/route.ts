import { NextResponse } from 'next/server';
import { BookingRequest } from '../../../types/booking';

export async function POST(request: Request) {
  try {
    const body: BookingRequest = await request.json();
    
    // Validate request mock logic
    if (!body.hotelId || !body.roomId || !body.checkIn || !body.checkOut) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' }, 
        { status: 400 }
      );
    }

    // Simulate network delay and processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate successful booking
    const mockBookingId = 'BKG-' + Math.random().toString(36).substr(2, 9).toUpperCase();

    return NextResponse.json({
      success: true,
      bookingId: mockBookingId,
      message: 'Booking confirmed successfully!'
    });
    
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Invalid request body' }, 
      { status: 400 }
    );
  }
}
