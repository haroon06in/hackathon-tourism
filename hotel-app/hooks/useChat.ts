import { useState, useCallback, useRef } from 'react';
import { ChatMessage, SendMessageRequest } from '../types/message';
import { api } from '../lib/api';

interface UseChatOptions {
  locationSlug?: string;
  guestProfile?: SendMessageRequest['guestProfile'];
}

export function useChat(options?: UseChatOptions) {
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
        locationSlug: options?.locationSlug,
        guestProfile: options?.guestProfile,
      });
      const withResponse = [...messagesRef.current, responseMessage];
      messagesRef.current = withResponse;
      setMessages(withResponse);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsTyping(false);
    }
  }, [options?.locationSlug, options?.guestProfile]);

  return {
    messages,
    isTyping,
    sendMessage
  };
}
