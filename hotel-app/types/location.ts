export interface MenuItem {
  name: string;
  category: string;
  price: number;
  dietary: string[];
}

export interface Location {
  id: string;
  name: string;
  slug: string;
  description: string;
  latitude: number;
  longitude: number;
  address: string;
  amenities: string[];
  menu: MenuItem[];
}
