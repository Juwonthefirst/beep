import { UUID } from "crypto";

export interface CurrentUser {
  id: number;
  username: string;
  email: string;
}

export interface AuthSuccessResponse {
  user?: CurrentUser;
  status?: string;
}
export interface AuthErrorResponse {
  error: string;
}

export type AuthResponse = AuthErrorResponse | AuthSuccessResponse;
export type UsernameExist = { exists: boolean } | AuthErrorResponse;

export interface ChatSocketTyping {
  typing: boolean;
  sender_username: string;
  room_name: string;
}

export interface ChatSocketMessage {
  room_name: string;
  message: string;
  sender_username: string;
  timestamp: string;
  uuid: UUID;
  attachment_url: string;
}
