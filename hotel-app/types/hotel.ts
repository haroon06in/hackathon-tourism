export interface Hotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  description: string;
  image: string;
  roomTypes: RoomType[];
}

export interface RoomType {
  id: string;
  name: string;
  price: number;
  capacity: number;
  amenities: string[];
  image: string;
}

export interface Preferences {
  bedType: 'Single' | 'Double' | 'Queen' | 'King';
  smoking: boolean;
  viewPreference: 'City' | 'Ocean' | 'Garden' | 'None';
  specialRequests: string;
}
