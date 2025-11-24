import { UUID } from "crypto";

export interface CurrentUser {
  id: number;
  username: string;
  email: string;
  profile_picture: string;
}

export interface BaseUser {
  id: number;
  username: string;
  email: string;
  profile_picture: string;
  is_online: boolean;
  last_online: string;
}

export interface User extends BaseUser {
  is_following_me: boolean;
  is_followed_by_me: boolean;
  is_online: boolean;
}

export interface Group {
  id: number;
  name: string;
  description: string;
  avatar: string;
  created_at: string;
}

export interface Message {
  id: number;
  uuid: string;
  body: string;
  attachment: string | null;
  timestamp: string;
  sender: number;
  reply_to: Message | null;
  room: number | null;
  is_deleted: boolean;
  is_edited: boolean;
}

export interface Attachment {
  id: number;
  file: string;
  type: string;
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

export interface ChatNotification {
  type: "chat_notification";
  sender: string;
  sender_profile_picture: string;
  group_name: string;
  message: string;
  is_group: boolean;
  room_name: string;
  timestamp: string;
}

export interface CallNotification {
  type: "call_notification";
  caller: string;
  room_name: string;
  is_video: boolean;
  is_group: boolean;
}

export interface OnlineStatusNotification {
  type: "online_status_notification";
  user: number;
  room_name: string;
  last_online: string;
  status: boolean;
}

export interface GroupEventNotification {
  type: "group_notification";
  group_id: number;
  notification: string;
}

export interface FriendEventNotification {
  type: "friend_notification";
  sender: string;
  sender_profile_picture: string;
  action: "sent" | "accepted";
}

export type NotificationMessage =
  | ChatNotification
  | CallNotification
  | OnlineStatusNotification
  | GroupEventNotification
  | FriendEventNotification;

export interface PaginatedResponse<Type> {
  count: number;
  next: string | null;
  previous: string | null;
  results: Type[];
}

interface ChatRoom {
  id: number;
  name: string;
  last_message: Message;
  unread_message_count: number;
  created_at: string;
}

export interface UserChatRoom extends ChatRoom {
  is_group: false;
  friend: BaseUser;
  group: null;
}

export interface GroupChatRoom extends ChatRoom {
  is_group: true;
  friend: null;
  group: Group;
}
