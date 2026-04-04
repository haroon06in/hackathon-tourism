import { Hotel } from '../types/hotel';
import { BookingRequest, BookingResponse } from '../types/booking';
import { Activity, ActivityBookingRequest } from '../types/activity';
import { ChatMessage, SendMessageRequest } from '../types/message';
import { Location } from '../types/location';
import { Profile, CreateProfileRequest } from '../types/profile';
import { ItineraryItem } from '../types/itinerary';
import { TransferRequest, TransferResponse } from '../types/transfer';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || body.message || `Request failed: ${res.status}`);
  }
  return res.json();
}

function post<T>(url: string, data: unknown): Promise<T> {
  return request<T>(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export const api = {
  // Hotels
  getHotels: () => request<Hotel[]>('/api/hotels'),
  submitBooking: (data: BookingRequest) => post<BookingResponse>('/api/booking', data),

  // Activities
  getActivities: () => request<Activity[]>('/api/activities'),
  submitActivityBooking: (data: ActivityBookingRequest) => post<BookingResponse>('/api/activities', data),

  // Locations
  getLocations: () => request<Location[]>('/api/locations'),

  // Profiles
  getProfile: (email: string) => request<Profile>(`/api/profiles?email=${encodeURIComponent(email)}`),
  createProfile: (data: CreateProfileRequest) => post<Profile>('/api/profiles', data),

  // Itinerary
  getItinerary: (profileId: string) => request<ItineraryItem[]>(`/api/itinerary?profileId=${encodeURIComponent(profileId)}`),
  updateItineraryItem: (data: { id: string; status?: string; check_in?: string; check_out?: string; guests?: number; notes?: string }) =>
    request<{ id: string; status: string }>('/api/itinerary', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
  deleteItineraryItem: (id: string) => request<{ success: boolean }>(`/api/itinerary?id=${encodeURIComponent(id)}`, { method: 'DELETE' }),

  // Transfer
  requestTransfer: (data: TransferRequest) => post<TransferResponse>('/api/transfer', data),

  // Concierge
  sendMessage: (data: SendMessageRequest) => post<ChatMessage>('/api/concierge', data),
};
