import React, { useState } from 'react';

export function CallButton() {
  const [callingState, setCallingState] = useState<'idle' | 'calling' | 'ended'>('idle');

  const handleCall = () => {
    setCallingState('calling');
    // Simulated mock call that ends after 4 seconds to represent no answer or voicemail
    setTimeout(() => {
      setCallingState('ended');
      setTimeout(() => setCallingState('idle'), 3000); // reset back to idle after 3s
    }, 4000);
  };

  const handleEndCall = () => {
    setCallingState('ended');
    setTimeout(() => setCallingState('idle'), 3000);
  };

  return (
    <div className="bg-surface-container rounded-xl p-6 space-y-6 shadow-sm border border-outline-variant/10">
      <h3 className="font-headline text-lg text-secondary">Quick Actions</h3>
      <div className="flex flex-col gap-3">
        {callingState === 'idle' && (
          <button 
            onClick={handleCall}
            className="flex items-center gap-3 w-full p-4 rounded-lg bg-primary text-on-primary transition-all hover:bg-primary-container hover:scale-[1.02] active:scale-95 shadow-sm"
          >
            <span className="material-symbols-outlined">call</span>
            <span className="font-medium">Call Front Desk</span>
          </button>
        )}
        
        {callingState === 'calling' && (
          <button 
            onClick={handleEndCall}
            className="flex items-center gap-3 w-full p-4 rounded-lg bg-secondary-container text-on-secondary-container hover:bg-error-container hover:text-on-error-container transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined animate-pulse">ring_volume</span>
            <span className="font-medium">Calling... (Tap to End)</span>
          </button>
        )}

        {callingState === 'ended' && (
          <button 
            disabled
            className="flex items-center gap-3 w-full p-4 rounded-lg border border-error/20 text-error bg-error/5"
          >
            <span className="material-symbols-outlined">call_end</span>
            <span className="font-medium">Call Ended</span>
          </button>
        )}
      </div>
    </div>
  );
}
