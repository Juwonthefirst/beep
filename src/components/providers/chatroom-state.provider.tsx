"use client";

import { createContext, useMemo } from "react";

import useChatSocket from "@/hooks/useChatSocket.hook";
import { ChatSocketSend, ChatSocketTyping } from "@/utils/types/client.type";
import { TypingUsers } from "@/utils/types/server-response.type";

export const TypingUsersContext = createContext<TypingUsers>([]);
export const CurrentRoomNameContext = createContext("");
export const ChatSocketControlsContext = createContext<{
  send: ChatSocketSend;
  typing: ChatSocketTyping;
} | null>(null);

const ChatroomProvider = ({
  roomName,
  children,
}: {
  roomName: string;
  children: React.ReactNode;
}) => {
  const chatsocket = useChatSocket(roomName);
  const chatsocketControls = useMemo(
    () => ({ send: chatsocket.send, typing: chatsocket.typing }),
    [chatsocket.send, chatsocket.typing]
  );
  return (
    <ChatSocketControlsContext value={chatsocketControls}>
      <CurrentRoomNameContext value={roomName}>
        <TypingUsersContext value={chatsocket.typingUsers}>
          {children}
        </TypingUsersContext>
      </CurrentRoomNameContext>
    </ChatSocketControlsContext>
  );
};

export default ChatroomProvider;
