export interface ChatMessage {
  id: string;
  sender: 'user' | 'hotel';
  text: string;
  timestamp: string;
}

export interface SendMessageRequest {
  text: string;
}
