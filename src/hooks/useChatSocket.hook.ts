"use client";

import { useState, useEffect, use, useMemo } from "react";

import { ChatSocketContext } from "@/components/providers/chat-socket.provider";
import { useQueryClient } from "@tanstack/react-query";
import {
  Attachment,
  GroupChatRoom,
  TypingUsers,
  UserChatRoom,
} from "@/utils/types/server-response.type";
import { chatListQueryOption, messageQueryOption } from "@/utils/queryOptions";
import { filterOutObjectFromResponse } from "@/utils/helpers/client-helper";

const useChatSocket = (room_name: string) => {
  // rework typing to use user id
  const { chatSocket } = use(ChatSocketContext);
  const [typingUsers, setTypingUsers] = useState<TypingUsers>([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.setQueryData(chatListQueryOption().queryKey, (old) => {
      if (!old) return old;

      const updatedPages = old.pages.map((response) => ({
        ...response,
        results: response.results.map((chatRoom) => ({
          ...chatRoom,
          unread_message_count:
            chatRoom.name === room_name ? 0 : chatRoom.unread_message_count,
        })),
      }));

      return { ...old, pages: updatedPages };
    });

    chatSocket.joinGroup(
      room_name,
      (newMessage) => {
        queryClient.setQueryData(
          messageQueryOption(room_name).queryKey,
          (old) => {
            if (!old) return old;
            let isMessageInQueryData = false;
            let messageResultIndex: number | null = null;
            const updatedPages = structuredClone(old.pages);

            const messageResponseIndex = old.pages.findIndex((response) => {
              messageResultIndex = response.results.findIndex(
                (result) => result.uuid === newMessage.uuid,
              );
              if (messageResultIndex !== -1) {
                isMessageInQueryData = true;
                return true;
              }
            });
            if (!isMessageInQueryData && newMessage.event === "chat")
              updatedPages[0].results = [
                newMessage,
                ...updatedPages[0].results,
              ];
            else if (
              isMessageInQueryData &&
              messageResultIndex !== null &&
              newMessage.event === "chat"
            ) {
              updatedPages[messageResponseIndex].results[messageResultIndex] =
                newMessage;
            }

            return { ...old, pages: updatedPages };
          },
        );

        queryClient.setQueryData(chatListQueryOption().queryKey, (old) => {
          if (!old) return old;
          const [updatedPages, outdatedChatRoom] = filterOutObjectFromResponse<
            UserChatRoom | GroupChatRoom
          >(newMessage.room, "id", old.pages);
          if (!outdatedChatRoom) {
            queryClient.invalidateQueries({
              queryKey: chatListQueryOption().queryKey,
              exact: true,
            });
            return old;
          }

          updatedPages[0].results = [
            {
              ...outdatedChatRoom,
              unread_message_count:
                outdatedChatRoom.name === room_name
                  ? 0
                  : ++outdatedChatRoom.unread_message_count,
              last_message: newMessage,
            },
            ...updatedPages[0].results,
          ];
          return { ...old, pages: updatedPages };
        });
      },
      (username: string) => {
        setTypingUsers((prev) => {
          if (prev.includes(username)) return prev;
          setTimeout(() => {
            setTypingUsers((current) =>
              current.filter((user) => user !== username),
            );
          }, 1500);
          return [...prev, username];
        });
      },
    );
    return () => {
      chatSocket.leaveGroup();
    };
  }, [room_name, chatSocket, queryClient]);

  return useMemo(
    () => ({
      typingUsers,
      send: (message: string, attachment?: Attachment) =>
        chatSocket.chat(message, attachment),
      typing: () => {
        chatSocket.typing();
      },
    }),
    [chatSocket, typingUsers],
  );
};

export default useChatSocket;
