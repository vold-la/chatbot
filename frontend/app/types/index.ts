export interface Message {
  id: number;
  sender: "user" | "agent";
  content: string;
  timestamp: number;
}
