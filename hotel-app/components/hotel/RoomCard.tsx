import React from 'react';
import { RoomType } from '../../types/hotel';
import Image from 'next/image';

interface RoomCardProps {
  room: RoomType;
  onBook: (room: RoomType) => void;
  isPopular?: boolean;
}

export function RoomCard({ room, onBook, isPopular }: RoomCardProps) {
  return (
    <div className="group flex flex-col bg-surface-container-lowest rounded-xl overflow-hidden editorial-shadow transition-transform hover:-translate-y-1 h-full">
      <div className="relative h-64 overflow-hidden shrink-0">
        <Image 
          src={room.image} 
          alt={room.name} 
          fill 
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {isPopular ? (
          <div className="absolute top-4 left-4 bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase shadow-sm">
            Most Requested
          </div>
        ) : (
          <div className="absolute top-4 right-4 bg-surface-container-lowest/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-primary tracking-wider uppercase shadow-sm">
            Available
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-headline text-primary leading-tight pr-2">{room.name}</h3>
          <span className="text-lg font-bold text-secondary shrink-0">
            ${room.price}
            <span className="text-xs font-normal text-on-surface-variant">/night</span>
          </span>
        </div>
        
        <p className="text-sm text-on-surface-variant mb-4">
          Up to {room.capacity} guests • View details
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {room.amenities.map((amenity, idx) => (
            <span 
              key={idx} 
              className="bg-surface-container text-on-surface-variant text-[10px] uppercase font-bold tracking-tighter px-2 py-1 rounded"
            >
              {amenity}
            </span>
          ))}
        </div>

        <button 
          onClick={() => onBook(room)} 
          className="mt-auto w-full py-3 bg-primary text-on-primary rounded-lg font-medium hover:bg-primary-container transition-colors active:scale-[0.98]"
        >
          Select Room
        </button>
      </div>
    </div>
  );
}
