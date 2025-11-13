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

const chatSocket = new ChatSocket({
  url: "ws://localhost:8000/ws/chat/",
  getAccessToken: getAccessToken,
});
interface ChatSocketContextValue {
  chatSocket: ChatSocket;
  connectionState: WebSocketConnectionState;
}

export const ChatSocketContext = createContext<ChatSocketContextValue>({
  chatSocket,
  connectionState: "disconnected",
});

const ChatSocketProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [connectionState, setConnectionState] =
    useState<WebSocketConnectionState>("connecting");

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      chatSocket.onConnectionStateChange = (connectionState) => {
        setConnectionState(connectionState);
      };
      await chatSocket.connect();
      setIsLoading(false);
    })();

    return () => {
      chatSocket.disconnect();
    };
  }, []);

  const chatSocketContextValue: ChatSocketContextValue = useMemo(
    () => ({ chatSocket, connectionState }),
    [connectionState]
  );

  if (isLoading) return <p>Loading...</p>;
  return (
    <ChatSocketContext value={chatSocketContextValue}>
      {children}
    </ChatSocketContext>
  );
};

export default ChatSocketProvider;
