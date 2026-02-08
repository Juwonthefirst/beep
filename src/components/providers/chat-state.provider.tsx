"use client";

import { BaseMessage } from "@/utils/types/server-response.type";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface ChatState {
  mode: "chat" | "edit" | "reply";
  messageObject: BaseMessage | null;
}

interface ChatStateContextType {
  chatState: ChatState;
  setChatState: Dispatch<SetStateAction<ChatState>>;
}

export const ChatStateContext = createContext<ChatStateContextType>({
  chatState: { mode: "chat", messageObject: null },
  setChatState: () => {},
});

const ChatStateProvider = ({ children }: { children: ReactNode }) => {
  const [chatState, setChatState] = useState<ChatState>({
    mode: "chat",
    messageObject: null,
  });
  const chatStateContextValue = useMemo(
    () => ({ chatState, setChatState }),
    [chatState, setChatState],
  );
  return (
    <ChatStateContext value={chatStateContextValue}>
      {children}
    </ChatStateContext>
  );
};

export default ChatStateProvider;
