export interface ChatMessage {
  id: string | number;
  from: 'me' | 'them' | 'system' | 'date';
  senderId?: string;
  senderName?: string;
  senderInitials?: string;
  senderColor?: string;
  text: string;
  time?: string;
  status?: 'sent' | 'delivered' | 'read';
  attachment?: ChatAttachment | null;
  replyTo?: { text: string; from: string } | null;
  reactions?: ChatReaction[];
  edited?: boolean;
  deleted?: boolean;
  encrypted?: boolean;
}

export interface ChatAttachment {
  url: string;
  decryptedUrl?: string;
  type: 'image' | 'audio' | 'file' | 'call';
  name?: string;
  fileName?: string;
  mimeType?: string;
  fileSize?: number;
  duration?: string;
  waveform?: number[];
  callType?: 'audio' | 'video';
  callStatus?: 'completed' | 'missed' | 'declined';
  iv?: string;
}

export interface ChatReaction {
  emoji: string;
  count: number;
  users: string[];
}

export interface ChatParticipant {
  user_id: string;
  username?: string;
  display_name?: string;
  avatar_url?: string;
  color?: string;
  initials?: string;
}

export interface ChatUser {
  userId: string;
  name: string;
  initials: string;
  color: string;
}
