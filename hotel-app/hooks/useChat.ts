import { useState, useCallback } from 'react';
import { ChatMessage } from '../types/message';
import { api } from '../lib/api';

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = useCallback(async (text: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const responseMessage = await api.sendMessage({ text });
      setMessages(prev => [...prev, responseMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Optional: Handle error state in UI
    } finally {
      setIsTyping(false);
    }
  }, []);

  return {
    messages,
    isTyping,
    sendMessage
  };
}
