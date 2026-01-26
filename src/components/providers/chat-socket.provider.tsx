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
import SplashScreen from "../splash-screen";

const chatSocket = new ChatSocket({ getAccessToken });

interface ChatSocketContextValue {
  chatSocket: ChatSocket;
  connectionState: WebSocketConnectionState;
  currentRoom: string | null;
}

export const ChatSocketContext = createContext<ChatSocketContextValue>({
  chatSocket,
  connectionState: "disconnected",
  currentRoom: null,
});

const ChatSocketProvider = ({ children }: { children: ReactNode }) => {
  const [connectionState, setConnectionState] =
    useState<WebSocketConnectionState>("connecting");
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);

  useEffect(() => {
    chatSocket.onRoomChange = (roomName) => {
      setCurrentRoom(roomName);
    };
    chatSocket.onConnectionStateChange = (connectionState) => {
      setConnectionState(connectionState);
    };
    chatSocket.connect();
    return () => {
      chatSocket.disconnect();
    };
  }, []);

  const chatSocketContextValue: ChatSocketContextValue = useMemo(
    () => ({ chatSocket, connectionState, currentRoom }),
    [connectionState, currentRoom],
  );

  if (connectionState === "connecting") return <SplashScreen />;
  return (
    <ChatSocketContext value={chatSocketContextValue}>
      {children}
    </ChatSocketContext>
  );
};

export default ChatSocketProvider;
