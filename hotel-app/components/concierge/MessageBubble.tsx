import React from 'react';
import { ChatMessage } from '../../types/message';
import { cn } from '../../lib/utils';
import { User, Hotel } from 'lucide-react';

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === 'user';
  
  const timeString = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (isUser) {
    return (
      <div className="flex items-start gap-3 flex-row-reverse ml-auto max-w-[85%] animate-in slide-in-from-right-2 duration-300">
        <div className="w-8 h-8 rounded-full bg-secondary-fixed flex-shrink-0 flex items-center justify-center">
            <span className="material-symbols-outlined text-sm text-on-secondary-fixed">person</span>
        </div>
        <div className="bg-primary text-on-primary p-4 rounded-xl rounded-tr-none shadow-sm">
            <p className="text-sm leading-relaxed">{message.text}</p>
            <span className="text-[10px] opacity-70 mt-2 block text-right">{timeString}</span>
        </div>
      </div>
    );
  }

  // Hotel response formatting
  return (
    <div className="flex items-start gap-3 max-w-[85%] animate-in slide-in-from-left-2 duration-300">
        <div className="w-8 h-8 rounded-full bg-surface-container flex-shrink-0 flex items-center justify-center">
            <span className="material-symbols-outlined text-sm text-primary">concierge</span>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant/10 shadow-sm p-4 rounded-xl rounded-tl-none">
            <p className="text-on-surface text-sm leading-relaxed">{message.text}</p>
            <span className="text-[10px] text-on-surface-variant mt-2 block">{timeString}</span>
        </div>
    </div>
  );
}
