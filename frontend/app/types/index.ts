export interface Message {
  id: number;
  content: string;
  user_id: number;
  timestamp: string;
  sender: 'user' | 'bot';
}
