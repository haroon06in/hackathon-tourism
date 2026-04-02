import { useState, useCallback, useRef } from 'react';
import { ChatMessage } from '../types/message';
import { api } from '../lib/api';

export function useChat(locationSlug?: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesRef = useRef<ChatMessage[]>([]);

  const sendMessage = useCallback(async (text: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...messagesRef.current, userMessage];
    messagesRef.current = updatedMessages;
    setMessages(updatedMessages);
    setIsTyping(true);

    try {
      const responseMessage = await api.sendMessage({
        text,
        history: messagesRef.current,
        locationSlug,
      });
      const withResponse = [...messagesRef.current, responseMessage];
      messagesRef.current = withResponse;
      setMessages(withResponse);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsTyping(false);
    }
  }, [locationSlug]);

  return {
    messages,
    isTyping,
    sendMessage
  };
}
