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

export interface Friend {
  id: number;
  username: string;
  profile_picture: string;
}

export interface User extends BaseUser {
  is_following_me: boolean;
  is_followed_by_me: boolean;
  is_online: boolean;
}

export interface Group {
  id: number;
  name: string;
  room_name: string;
  description: string;
  avatar: string;
  created_at: string;
  mappedMembers: Map<number, GroupMember>;
  members: GroupMember[];
}

export interface GroupMember {
  id: number;
  username: string;
  role: string | null;
  profile_picture: string;
}

export interface Message {
  id: number;
  uuid: UUID;
  body: string;
  attachment: Attachment | null;
  created_at: string;
  sender: number;
  reply_to: ReplyMessage | null;
  room: number;
  is_deleted: boolean;
  is_edited: boolean;
}

export type ReplyMessage = Omit<
  Message,
  "uuid" | "reply_to" | "created_at" | "is_edited" | "room" | "sender"
> & { sender: string };

export type LastMessage = Message & { sender_username: string };

export interface Attachment {
  id: number;
  file: string;
  content_type: string;
}

export interface AuthSuccessResponse {
  user?: CurrentUser;
  status?: string;
}

export interface ErrorResponse {
  error: string;
}

export type AuthResponse = ErrorResponse | AuthSuccessResponse;
export type UsernameExist = { exists: boolean } | ErrorResponse;

export type FormResponse<ReturnType = unknown> =
  | { status: "success"; data: ReturnType }
  | { status: "error"; error: string }
  | { status: "idle" };

export interface ChatSocketTyping {
  typing: boolean;
  sender_username: string;
  room_name: string;
}
export type ChatEvent = "chat" | "delete" | "edit";

export interface ChatSocketMessage extends LastMessage {
  event: ChatEvent;
  room_name: string;
}

export interface ChatNotification {
  type: "chat_notification";
  sender_username: string;
  sender_profile_picture: string;
  group_name: string;
  message: LastMessage;
  is_group: boolean;
  room_name: string;
  event: ChatEvent;
}

export interface CallNotification {
  type: "call_notification";
  caller_username: string;
  caller_profile_picture: string;
  call_id: string;
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
  last_message: LastMessage | null;
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

export type TypingUsers = string[];
export type SignupResponse = { user: CurrentUser; avatar_upload_link: string };
export type GroupCreateResponse = Group & { avatar_upload_link: string };
export const isSignupResponseData = (data: unknown): data is SignupResponse => {
  return (
    typeof data === "object" &&
    data !== null &&
    "user" in data &&
    "avatar_upload_link" in data
  );
};

export const isGroupCreateResponseData = (
  data: unknown
): data is GroupCreateResponse => {
  return (
    typeof data === "object" &&
    data !== null &&
    "id" in data &&
    "avatar_upload_link" in data
  );
};

export interface CallAccessToken {
  room_url: string;
  token: string;
}

export interface RoomMetadata {
  is_video_call: boolean;
  host_id: number;
  is_group: boolean;
}

export interface ParticipantMetaData extends Friend {
  role: string;
}
