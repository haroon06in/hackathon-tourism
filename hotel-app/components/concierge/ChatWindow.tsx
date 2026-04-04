import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useChat } from '../../hooks/useChat';
import { useGuest } from '../../contexts/GuestContext';
import { useCurrentBranch } from '../../hooks/useCurrentBranch';
import { MessageBubble } from './MessageBubble';

const QUICK_ACTIONS = [
  "Order Coffee",
  "Valet Request",
  "Dinner Reservation",
  "Late Check-out",
  "What's for dinner?"
];

export function ChatWindow() {
  const { guest } = useGuest();
  const { branchSlug } = useCurrentBranch();

  const guestProfile = useMemo(() => guest ? {
    name: guest.full_name,
    persona: guest.persona || undefined,
    preferences: guest.preferences,
  } : undefined, [guest]);

  const { messages, isTyping, sendMessage } = useChat({ guestProfile, locationSlug: branchSlug || undefined });
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (inputText.trim()) {
      sendMessage(inputText.trim());
      setInputText('');
    }
  };

  const handleQuickAction = (action: string) => {
    sendMessage(action);
  };

  return (
    <section className="flex-1 flex flex-col bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10 overflow-hidden min-h-[500px] h-[calc(100vh-260px)] md:max-h-[700px]">
      {/* Chat Header */}
      <div className="bg-surface-container-high px-6 py-5 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary-fixed-dim flex items-center justify-center text-primary">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>spa</span>
          </div>
          <div>
            <h1 className="font-headline text-xl text-on-surface">Concierge Services</h1>
            <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Online & Ready
            </p>
          </div>
        </div>
        <div className="flex gap-2">
            <button className="p-2 rounded-full hover:bg-surface-variant text-on-surface-variant transition-colors">
                <span className="material-symbols-outlined">more_vert</span>
            </button>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar bg-surface/30">
        <div className="flex justify-center mb-6">
            <span className="bg-surface-container text-on-surface-variant text-[10px] px-3 py-1 rounded-full uppercase tracking-widest font-bold shadow-sm">Today</span>
        </div>

        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-on-surface-variant opacity-80 gap-3">
             <span className="material-symbols-outlined text-4xl">front_hand</span>
             <p className="text-sm font-medium">Hello. How can we elevate your stay today?</p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))
        )}

        {isTyping && (
           <div className="flex justify-start mb-4">
             <div className="bg-surface-container-lowest border border-outline-variant/10 text-on-surface-variant px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-3 shadow-sm">
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </span>
                <span className="text-xs font-medium">Concierge is typing</span>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} className="h-2" />
      </div>

      {/* Chat Input Area */}
      <div className="p-5 bg-surface-container-lowest border-t border-outline-variant/15 z-10 w-full">
        <form onSubmit={handleSubmit} className="bg-surface-container-high rounded-xl p-1.5 flex items-center gap-2 shadow-inner border border-outline-variant/5">
            <button type="button" className="p-2 text-on-surface-variant hover:text-primary transition-colors flex shrink-0">
                <span className="material-symbols-outlined">add_circle</span>
            </button>
            <input 
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 px-2 outline-none w-full min-w-0" 
              placeholder="Tell us how we can help..." 
              required
            />
            <button 
              type="submit" 
              disabled={!inputText.trim() || isTyping}
              className="bg-primary text-on-primary p-2.5 rounded-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-md shadow-primary/20 disabled:opacity-50 disabled:pointer-events-none shrink-0"
            >
              <span className="material-symbols-outlined text-[20px]">send</span>
            </button>
        </form>

        <div className="mt-4 flex gap-2 overflow-x-auto hide-scrollbar pb-1 -mx-2 px-2 mask-linear">
            {QUICK_ACTIONS.map(action => (
              <button 
                key={action}
                onClick={() => handleQuickAction(action)}
                disabled={isTyping}
                className="whitespace-nowrap bg-surface-container hover:bg-secondary-container hover:text-on-secondary-container px-4 py-2 rounded-full text-[11px] uppercase tracking-wide font-bold transition-all disabled:opacity-50 shrink-0 border border-outline-variant/10 shadow-sm"
              >
                {action}
              </button>
            ))}
        </div>
      </div>
    </section>
  );
}
