import "client-only";

import { use } from "react";

import { ChatSocketContext } from "@/components/providers/chat-socket.provider";
import { NotificationSocketStateContext } from "@/components/providers/notification-socket-state.provider";
import {
  isWebSocketFailedState,
  isWebSocketLoadingState,
  isWebSocketSuccessState,
} from "@/utils/types/client.type";

const useSocketState = () => {
  const chatSocketState = use(ChatSocketContext);
  const notificationSocketConnectionState = use(NotificationSocketStateContext);
  return {
    is_connected:
      isWebSocketSuccessState(chatSocketState.connectionState) &&
      isWebSocketSuccessState(notificationSocketConnectionState),
    is_disconnected:
      isWebSocketFailedState(chatSocketState.connectionState) ||
      isWebSocketFailedState(notificationSocketConnectionState),
    is_connecting:
      isWebSocketLoadingState(chatSocketState.connectionState) ||
      isWebSocketLoadingState(notificationSocketConnectionState),
    currentRoom: chatSocketState.currentRoom,
    chatSocketConnectionState: chatSocketState.connectionState,
    notificationSocketConnectionState,
  };
};

export default useSocketState;
