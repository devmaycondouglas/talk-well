export interface User {
  id: string;
  name: string;
  avatar?: string;
  status?: "online" | "offline" | "busy";
}

export interface Message {
  id: number;
  external_id: string;
  direction: "SENT" | "RECEIVED";
  content: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  external_id: string;
  state: "OPEN" | "CLOSED";
  created_at: string;
  closed_at: string;
}

export interface ConversationDetails extends Conversation {
  messages: Message[];
}
