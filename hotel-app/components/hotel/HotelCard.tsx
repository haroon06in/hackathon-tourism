import React from 'react';
import { Hotel } from '../../types/hotel';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Star, MapPin } from 'lucide-react';
import Image from 'next/image';

interface HotelCardProps {
  hotel: Hotel;
  onSelect: (hotel: Hotel) => void;
}

export function HotelCard({ hotel, onSelect }: HotelCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
      <div className="relative h-48 w-full">
        <Image 
          src={hotel.image} 
          alt={hotel.name} 
          fill 
          className="object-cover"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold leading-tight">{hotel.name}</h3>
          <div className="flex items-center bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-medium shrink-0">
            <Star className="w-4 h-4 mr-1 text-yellow-500 fill-yellow-500" />
            {hotel.rating}
          </div>
        </div>
        <div className="flex items-center text-gray-500 text-sm mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          {hotel.location}
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{hotel.description}</p>
        <div className="mt-auto">
          <Button className="w-full" onClick={() => onSelect(hotel)}>
            View Rooms
          </Button>
        </div>
      </div>
    </Card>
  );
}
