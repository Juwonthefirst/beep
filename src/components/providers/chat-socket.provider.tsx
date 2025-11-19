"use client";

import { getAccessToken } from "@/utils/actions";
import { WebSocketConnectionState } from "@/utils/types/client.type";
import { ChatSocket } from "@/utils/websocket-handlers";
import {
  useEffect,
  createContext,
  type ReactNode,
  useState,
  useMemo,
} from "react";

const chatSocket = new ChatSocket({ getAccessToken });

interface ChatSocketContextValue {
  chatSocket: ChatSocket;
  connectionState: WebSocketConnectionState;
}

export const ChatSocketContext = createContext<ChatSocketContextValue>({
  chatSocket,
  connectionState: "disconnected",
});

const ChatSocketProvider = ({ children }: { children: ReactNode }) => {
  const [connectionState, setConnectionState] =
    useState<WebSocketConnectionState>("connecting");

  useEffect(() => {
    chatSocket.onConnectionStateChange = (connectionState) => {
      setConnectionState(connectionState);
    };
    chatSocket.connect();
    return () => {
      chatSocket.disconnect();
    };
  }, []);

  const chatSocketContextValue: ChatSocketContextValue = useMemo(
    () => ({ chatSocket, connectionState }),
    [connectionState]
  );

  if (!(connectionState === "connected" || connectionState === "reconnected"))
    return <p>{connectionState}</p>;
  return (
    <ChatSocketContext value={chatSocketContextValue}>
      {children}
    </ChatSocketContext>
  );
};

export default ChatSocketProvider;
