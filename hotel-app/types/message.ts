export interface ChatMessage {
  id: string;
  sender: 'user' | 'hotel';
  text: string;
  timestamp: string;
}

export interface SendMessageRequest {
  text: string;
  history?: ChatMessage[];
  guestProfile?: {
    name?: string;
    persona?: string;
    preferences?: Record<string, unknown>;
  };
  locationSlug?: string;
}
