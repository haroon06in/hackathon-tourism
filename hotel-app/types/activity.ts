export interface Activity {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  timeSlots: string[];
  duration: string;
  category: string;
}

export interface ActivityBookingRequest {
  activityId: string;
  date: string;
  timeSlot: string;
  guests: number;
}
