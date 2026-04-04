"use client";

import { ChatWindow } from '../../../components/concierge/ChatWindow';
import { CallButton } from '../../../components/concierge/CallButton';
import Image from 'next/image';

export default function ConciergePage() {
  return (
    <div className="flex flex-col md:flex-row max-w-7xl mx-auto w-full gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12 px-6 pt-4">
      {/* Left Column: Sidebar / Profile Info */}
      <aside className="w-full md:w-80 flex flex-col gap-6 shrink-0 z-10">
        
        {/* Personal Concierge Info Card */}
        <div className="bg-surface-container-low rounded-xl p-6 overflow-hidden relative border border-outline-variant/10 shadow-sm">
          <div className="relative z-10">
            <h2 className="font-headline text-2xl text-primary mb-2">Personal Concierge</h2>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Your dedicated assistant at Kuriftu Resorts is available 24/7 to curate your Lakeside Living experience.
            </p>
          </div>
          <div className="absolute -bottom-4 -right-4 opacity-[0.05] pointer-events-none">
            <span className="material-symbols-outlined text-[100px]" style={{ fontVariationSettings: "'FILL' 1" }}>support_agent</span>
          </div>
        </div>
        
        {/* Call Quick Actions Component */}
        <CallButton />
        
        {/* Promotional Card Image */}
        <div className="rounded-xl overflow-hidden aspect-video relative group cursor-pointer shadow-sm border border-outline-variant/10">
          <Image 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwVlmhTL2HrwLMnCDQtMTKR3Zl7X5ewzBUw03lgRT7yANPnN-4f-oR087OeSuqHZz85fp9HhQNgjBt0Hv2ach3dt4rQl7vzDzc9f-vbM0NLTC9IWxw1sM2AxiZW6KpdLgIIUIvAYjz67Bn4jM6WPnIAQjYQmtG3cEsWnfjWaRsxmjyd85ptUYn_aNktgu1cq5I5S47JR-UNF6_d8ksT4GVbxG0jrvRN9qfFAf1YieKxX0zt6vz9KIT8HF7FEIYeH68xgvOsvsZ8A"
            alt="Spa therapy" 
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent flex items-end p-5">
            <p className="text-on-primary font-headline italic tracking-wide">Explore our Wellness Spa</p>
          </div>
        </div>

      </aside>

      {/* Right Column: Chat Interface Component */}
      <ChatWindow />
    </div>
  );
}
