import "client-only";

import { use } from "react";

import { ChatSocketContext } from "@/components/providers/chat-socket.provider";
import { NotificationSocketStateContext } from "@/components/providers/notification-socket-state.provider";

const useSocketState = () => {
  const chatSocketState = use(ChatSocketContext);
  const notificationSocketConnectionState = use(NotificationSocketStateContext);
  return {
    currentRoom: chatSocketState.currentRoom,
    chatSocketConnectionState: chatSocketState.connectionState,
    notificationSocketConnectionState,
  };
};

export default useSocketState;
