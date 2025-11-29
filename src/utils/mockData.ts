import { UUID } from "crypto";
import {
  CurrentUser,
  User,
  Group,
  Message,
  PaginatedResponse,
  UserChatRoom,
  GroupChatRoom,
  ChatNotification,
  CallNotification,
  OnlineStatusNotification,
  GroupEventNotification,
  FriendEventNotification,
  ChatSocketMessage,
  ChatSocketTyping,
  Attachment,
} from "./types/server-response.type";

// ============ USERS ============

export const mockCurrentUser: CurrentUser = {
  id: 1,
  username: "juwon",
  email: "juwon@example.com",
  profile_picture: "/images/avatar-juwon.png",
};

// User generator
export function createUser(
  id: number,
  username: string,
  isFollowingMe = false,
  isFollowedByMe = false,
  isOnline = true
): User {
  return {
    id,
    username,
    email: `${username}@example.com`,
    profile_picture: `/media/uploads/profile-picture/${id}.webp`,
    last_online: isOnline
      ? new Date().toISOString()
      : new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    is_following_me: isFollowingMe,
    is_followed_by_me: isFollowedByMe,
    is_online: isOnline,
  };
}

export const mockUsers: User[] = [
  createUser(0, "alice", true, false, false),
  createUser(1, "bob", false, true, true),
  createUser(2, "charlie", true, true, false),
  createUser(3, "diana", false, false, true),
];

// ============ GROUPS ============

// Group generator
export function createGroup(
  id: number,
  name: string,
  description: string
): Group {
  return {
    id,
    name,
    description,
    avatar: `/images/group-${name.toLowerCase().replace(/\s+/g, "-")}.png`,
    created_at: new Date().toISOString(),
  };
}

export const mockGroups: Group[] = [
  createGroup(1, "Beep Devs", "All things beep development"),
  createGroup(2, "Design Team", "UI/UX discussions and feedback"),
  createGroup(3, "Project Alpha", "Internal project planning"),
];

// ============ MESSAGES ============

export function createMessage(
  id: number,
  body: string,
  sender: number,
  attachment: Attachment | null = null,
  timestamp = new Date().toISOString(),
  room: number | null = null,
  replyTo?: Message
): Message {
  const uuid = crypto.randomUUID();
  const msg = {
    id,
    body,
    sender,
    uuid,
    attachment,
    timestamp,
    reply_to: replyTo,
    room,
    is_deleted: false,
    is_edited: false,
  } as Message;

  return msg;
}

export const mockMessages: Message[] = [
  createMessage(1, "Hey — welcome to Beep!", 1),
  createMessage(2, "Thanks! Happy to be here.", 2),
  createMessage(
    3,
    "Nice to meet you both",
    1,
    null,
    undefined,
    null,
    createMessage(1, "Hey — welcome to Beep!", 2)
  ),
  createMessage(4, "How's the project going?", 1),
  createMessage(5, "Pretty good, wrapping up phase 2", 2),
  createMessage(6, "Looking forward to the next phase", 1, {
    id: 1,
    file: "/default.webp",
    content_type: "image/webp",
  }),

  createMessage(7, "Hey — welcome to Beep!", 1),
  createMessage(8, "Thanks! Happy to be here.", 2),
  createMessage(
    9,
    "Nice to meet you both",
    4,
    null,
    undefined,
    null,
    createMessage(
      1,
      "Hey — welcome to Beep hshhdh shjua8ujwwh sgshah gdjhhkjdb bbnzm hsfh nhgu jnvjwbvbj hj!",
      1,
      {
        id: 1,
        file: "/default.webp",
        content_type: "image/webp",
      }
    )
  ),
  createMessage(10, "How's the project going?", 1),
  createMessage(11, "Pretty good, wrapping up phase 2", 2),
  createMessage(12, "Looking forward to the next phase", 1),
];

// Generate list of messages
export function createMessagesList(count: number, sender = 1): Message[] {
  return Array.from({ length: count }, (_, i) =>
    createMessage(i + 1, `Message ${i + 1}`, sender)
  );
}

// ============ CHAT ROOMS ============

export const mockUserChatRooms: UserChatRoom[] = [
  {
    id: 10,
    name: "chat-1-2",
    last_message: mockMessages[0],
    unread_message_count: 2,
    is_group: false,
    friend: createUser(0, "alice", true),
    group: null,
  },
  {
    id: 11,
    name: "chat-1-3",
    last_message: mockMessages[2],
    unread_message_count: 0,
    is_group: false,
    friend: createUser(1, "bob", false, true, true),
    group: null,
  },
  {
    id: 12,
    name: "chat-5-9",
    last_message: mockMessages[3],
    unread_message_count: 5,
    is_group: false,
    friend: createUser(2, "charlie"),
    group: null,
  },
  {
    id: 10,
    name: "chat-1-2",
    last_message: mockMessages[0],
    unread_message_count: 2,
    is_group: false,
    friend: createUser(3, "alice", true),
    group: null,
  },
  {
    id: 11,
    name: "chat-1-3",
    last_message: mockMessages[2],
    unread_message_count: 0,
    is_group: false,
    friend: createUser(3, "bob", false, true, true),
    group: null,
  },
  {
    id: 12,
    name: "chat-5-9",
    last_message: mockMessages[3],
    unread_message_count: 5,
    is_group: false,
    friend: createUser(0, "charlie"),
    group: null,
  },
  {
    id: 10,
    name: "chat-1-2",
    last_message: mockMessages[0],
    unread_message_count: 2,
    is_group: false,
    friend: createUser(1, "alice", true),
    group: null,
  },
  {
    id: 11,
    name: "chat-1-3",
    last_message: mockMessages[2],
    unread_message_count: 0,
    is_group: false,
    friend: createUser(2, "bob", false, true, true),
    group: null,
  },
  {
    id: 12,
    name: "chat-5-9",
    last_message: mockMessages[3],
    unread_message_count: 5,
    is_group: false,
    friend: createUser(1, "charlie"),
    group: null,
  },
  {
    id: 10,
    name: "chat-1-2",
    last_message: mockMessages[0],
    unread_message_count: 2,
    is_group: false,
    friend: createUser(1, "alice", true),
    group: null,
  },
  {
    id: 11,
    name: "chat-1-3",
    last_message: mockMessages[2],
    unread_message_count: 0,
    is_group: false,
    friend: createUser(3, "bob", false, true, true),
    group: null,
  },
  {
    id: 12,
    name: "chat-5-9",
    last_message: mockMessages[3],
    unread_message_count: 5,
    is_group: false,
    friend: createUser(2, "charlie"),
    group: null,
  },
  {
    id: 10,
    name: "chat-1-2",
    last_message: mockMessages[0],
    unread_message_count: 2,
    is_group: false,
    friend: createUser(1, "alice", true),
    group: null,
  },
  {
    id: 11,
    name: "chat-1-3",
    last_message: mockMessages[2],
    unread_message_count: 0,
    is_group: false,
    friend: createUser(3, "bob", false, true, true),
    group: null,
  },
  {
    id: 12,
    name: "chat-5-9",
    last_message: mockMessages[3],
    unread_message_count: 5,
    is_group: false,
    friend: createUser(2, "charlie"),
    group: null,
  },
];

export const mockGroupChatRooms: GroupChatRoom[] = [
  {
    id: 20,
    name: "group-2",
    last_message: mockMessages[5],
    unread_message_count: 0,
    is_group: true,
    friend: null,
    group: mockGroups[0],
  },
  {
    id: 21,
    name: "group-3",
    last_message: mockMessages[4],
    unread_message_count: 3,
    is_group: true,
    friend: null,
    group: mockGroups[1],
  },
];

// ============ PAGINATED RESPONSE ============

export function makePaginated<T>(
  items: T[],
  page = 1,
  pageSize = 10
): PaginatedResponse<T> {
  const count = items.length;
  const start = (page - 1) * pageSize;
  const results = items.slice(start, start + pageSize);
  const hasNext = start + pageSize < count;
  const next = hasNext ? `/?page=${page + 1}` : null;
  const previous = page > 1 ? `/?page=${page - 1}` : null;

  return { count, next, previous, results };
}

// ============ NOTIFICATIONS ============

export function createChatNotification(
  sender: string,
  message: string,
  isGroup = false,
  roomName = sender
): ChatNotification {
  return {
    type: "chat_notification",
    sender,
    sender_profile_picture: `/images/${sender}.png`,
    group_name: isGroup ? roomName : "",
    message,
    is_group: isGroup,
    room_name: roomName,
    timestamp: new Date().toISOString(),
  };
}

export function createCallNotification(
  caller: string,
  roomName: string,
  isVideo = false,
  isGroup = false
): CallNotification {
  return {
    type: "call_notification",
    caller,
    room_name: roomName,
    is_video: isVideo,
    is_group: isGroup,
  };
}

export const mockNotifications: (
  | ChatNotification
  | CallNotification
  | OnlineStatusNotification
  | GroupEventNotification
  | FriendEventNotification
)[] = [
  createChatNotification("alice", "Hey, are you free?"),
  createChatNotification("bob", "Check out this design", true, "design-team"),
  createCallNotification("charlie", "call-room-1", false, false),
  {
    type: "online_status_notification",
    user: 3,
    status: true,
  },
  {
    type: "group_notification",
    group_id: 1,
    notification: "A new member joined the group",
  },
  {
    type: "friend_notification",
    sender: "diana",
    sender_profile_picture: "/images/diana.png",
    action: "sent",
  },
];

// ============ CHAT SOCKET ============

export function createChatSocketMessage(
  roomName: string,
  message: string,
  senderUsername: string,
  attachmentUrl = ""
): ChatSocketMessage {
  return {
    room_name: roomName,
    message,
    sender_username: senderUsername,
    timestamp: new Date().toISOString(),
    uuid: "00000000-0000-0000-0000-000000000000" as UUID,
    attachment_url: attachmentUrl,
  };
}

export const mockChatSocketMessages: ChatSocketMessage[] = [
  createChatSocketMessage("general", "Socket message 1", "alice"),
  createChatSocketMessage("general", "Socket message 2", "bob"),
  createChatSocketMessage("dev-team", "Socket message 3", "charlie"),
];

export const mockChatSocketTypings: ChatSocketTyping[] = [
  { typing: true, sender_username: "alice", room_name: "general" },
  { typing: true, sender_username: "bob", room_name: "general" },
  { typing: false, sender_username: "charlie", room_name: "dev-team" },
];

// ============ EXPORT ALL ============

const mockData = {
  mockCurrentUser,
  createUser,
  mockUsers,
  createGroup,
  mockGroups,
  createMessage,
  createMessagesList,
  mockMessages,
  mockUserChatRooms,
  mockGroupChatRooms,
  makePaginated,
  createChatNotification,
  createCallNotification,
  mockNotifications,
  createChatSocketMessage,
  mockChatSocketMessages,
  mockChatSocketTypings,
};

export default mockData;
