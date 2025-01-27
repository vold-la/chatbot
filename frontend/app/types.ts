export interface BaseMessage {
  id: number;
  content: string;
  sender: 'user' | 'bot';
  timestamp: string;
  deleted_at: string | null;
  updated_at: string | null;
}

export interface Message {
  id: number;
  content: string;
  sender: 'user' | 'bot';
  user_id: number;
  timestamp: string;
  deleted_at: string | null;
  updated_at: string | null;
}

export interface User {
  id: number;
  email: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  token_type: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  name: string;
}
