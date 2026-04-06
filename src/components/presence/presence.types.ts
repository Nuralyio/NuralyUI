/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

export interface PresenceUser {
  userId?: string;
  displayName: string;
  initials?: string;
  color: string;
  avatarUrl?: string | null;
}

export interface PresenceChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
  me: boolean;
}

export interface PresenceChatState {
  user: PresenceUser;
  conversationId: string | null;
  loading: boolean;
  x: number;
  y: number;
  savedX: number;
  savedY: number;
  z: number;
  minimized: boolean;
  messages: PresenceChatMessage[];
  draftText: string;
}
