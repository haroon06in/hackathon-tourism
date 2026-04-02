import { Hotel } from '../types/hotel';
import { BookingRequest, BookingResponse } from '../types/booking';
import { Activity, ActivityBookingRequest } from '../types/activity';
import { ChatMessage, SendMessageRequest } from '../types/message';

export const api = {
  getHotels: async (): Promise<Hotel[]> => {
    const res = await fetch('/api/hotels');
    if (!res.ok) throw new Error('Failed to fetch hotels');
    return res.json();
  },

  submitBooking: async (data: BookingRequest): Promise<BookingResponse> => {
    const res = await fetch('/api/booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to submit booking');
    return res.json();
  },

  getActivities: async (): Promise<Activity[]> => {
    const res = await fetch('/api/activities');
    if (!res.ok) throw new Error('Failed to fetch activities');
    return res.json();
  },

  submitActivityBooking: async (data: ActivityBookingRequest): Promise<BookingResponse> => {
    const res = await fetch('/api/activities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to book activity');
    return res.json();
  },

  sendMessage: async (data: SendMessageRequest): Promise<ChatMessage> => {
    const res = await fetch('/api/concierge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to send message');
    return res.json();
  }
};
