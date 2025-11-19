import { useState, useEffect, use } from "react";

import { ChatSocketContext } from "@/components/providers/chat-socket.provider";
import { useQueryClient } from "@tanstack/react-query";

const useChatSocket = (room_name: string) => {
  const { chatSocket, connectionState } = use(ChatSocketContext);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    chatSocket.joinGroup(
      room_name,
      (message) => {
        console.log(message);
      },
      (username: string) => {
        setTypingUsers((prev) => {
          if (prev.includes(username)) return prev;
          // setTimeout(() => {
          //   setTypingUsers((current) =>
          //     current.filter((user) => user !== username)
          //   );
          // }, 3000);
          return [...prev, username];
        });
      }
    );
    return () => {
      chatSocket.leaveGroup();
    };
  }, [room_name, chatSocket]);

  return {
    typingUsers,
    send: (message: string, attachment?: { id: number; url: string }) =>
      chatSocket.chat(message, attachment),
    typing: () => {
      chatSocket.typing();
    },
    connectionState,
  };
};

export default useChatSocket;
