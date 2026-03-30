import React from 'react';
import { Activity } from '../../types/activity';
import Image from 'next/image';

interface ActivityCardProps {
  activity: Activity;
  onBook: (activity: Activity) => void;
  index: number;
}

export function ActivityCard({ activity, onBook, index }: ActivityCardProps) {
  // Make every 4th item (or specifically Cultural Dinner) a wide card based on layout logic
  const isWide = index % 4 === 3; 

  if (isWide) {
    return (
      <div className="group relative overflow-hidden bg-surface-container-low rounded-xl flex flex-col md:col-span-2 lg:col-span-3 lg:flex-row transition-all hover:-translate-y-1 shadow-sm border border-outline-variant/5">
        <div className="lg:w-1/2 aspect-video lg:aspect-auto overflow-hidden relative min-h-[300px]">
          <Image 
            src={activity.image} 
            alt={activity.name} 
            fill 
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <div className="p-10 lg:w-1/2 flex flex-col justify-center">
            <div className="flex justify-between items-start mb-6 gap-4">
                <div>
                    <h3 className="text-4xl font-headline text-primary mb-3 leading-tight">{activity.name}</h3>
                    <div className="flex gap-4 flex-wrap">
                        <div className="bg-secondary-container px-3 py-1.5 rounded text-on-secondary-container text-xs font-semibold flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[16px]">schedule</span> {activity.duration}
                        </div>
                        <div className="bg-tertiary-fixed text-on-tertiary-fixed-variant px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5">
                            {activity.category}
                        </div>
                    </div>
                </div>
                <span className="text-3xl font-headline text-secondary shrink-0 pt-1">
                  ${activity.price}
                  <span className="text-sm font-sans font-normal text-on-surface-variant">/pp</span>
                </span>
            </div>
            
            <p className="text-on-surface-variant text-lg mb-10 leading-relaxed max-w-xl">
              {activity.description}
            </p>
            
            <button 
              onClick={() => onBook(activity)}
              className="inline-flex items-center justify-center bg-primary text-on-primary px-8 py-4 rounded-lg font-bold text-lg gap-3 self-start hover:bg-primary-container transition-all active:scale-[0.98] shadow-md shadow-primary/20"
            >
              Reserve Dinner Experience
              <span className="material-symbols-outlined text-[20px]">restaurant</span>
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative overflow-hidden bg-surface-container-low rounded-xl flex flex-col transition-all hover:-translate-y-1 shadow-sm border border-outline-variant/5">
      <div className="aspect-video overflow-hidden relative">
        <Image 
          src={activity.image} 
          alt={activity.name} 
          fill 
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="p-8 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-headline text-primary leading-tight pr-4">{activity.name}</h3>
          <span className="text-lg font-bold text-secondary flex items-baseline">
            ${activity.price}
            <span className="text-[10px] font-normal text-on-surface-variant ml-0.5 uppercase tracking-wider">/pp</span>
          </span>
        </div>
        
        <div className="flex gap-3 mb-5 flex-wrap">
            <div className="bg-secondary-container/50 px-2.5 py-1 rounded text-on-secondary-container text-xs font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">schedule</span> {activity.duration}
            </div>
            <div className="bg-surface-container-high px-2.5 py-1 rounded text-on-surface-variant text-xs font-semibold flex items-center gap-1">
                {activity.category}
            </div>
        </div>
        
        <p className="text-on-surface-variant text-sm mb-8 leading-relaxed flex-grow">
          {activity.description}
        </p>
        
        <button 
          onClick={() => onBook(activity)}
          className="mt-auto inline-flex items-center text-primary font-bold gap-2 group/btn hover:text-primary-container transition-colors"
        >
            Select Experience
            <span className="material-symbols-outlined text-[18px] transition-transform group-hover/btn:translate-x-1">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
