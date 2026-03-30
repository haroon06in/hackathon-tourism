import { Preferences } from './hotel';

export interface BookingRequest {
  hotelId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  preferences: Preferences;
}

export interface BookingResponse {
  success: boolean;
  bookingId?: string;
  message: string;
}
