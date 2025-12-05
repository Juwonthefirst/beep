"use client";

import {
  chatQueryOption,
  currentUserQueryOption,
  messageQueryOption,
} from "@/utils/queryOptions";
import {
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useEffect, useMemo, useRef } from "react";
import MessageLoading from "./message-loading";
import {
  createMessageGroups,
  parseDateString,
  watchElementIntersecting,
} from "@/utils/helpers/client-helper";
import { UUID } from "crypto";
import MessageGroup from "./message-group";
import useChatSocket from "@/hooks/useChatSocket.hook";
import TypingIndicator from "./typing-indicator";

const MessaageView = ({ roomName }: { roomName: string }) => {
  const { data, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useSuspenseInfiniteQuery(messageQueryOption(roomName));
  const { data: chatDetails } = useSuspenseQuery(chatQueryOption(roomName));
  const { data: currentUser } = useSuspenseQuery(currentUserQueryOption);
  const messageViewRef = useRef<HTMLDivElement | null>(null);
  const lastMessageUUId = useRef<UUID>(null);
  const intersectingElement = useRef<HTMLDivElement | null>(null);
  const { typingUsers } = useChatSocket(roomName);

  const messageGroups = useMemo(
    () =>
      createMessageGroups(data.pages.flatMap((response) => response.results)),
    [data]
  );

  useEffect(() => {
    if (isFetchingNextPage || !hasNextPage) return;

    const observer = watchElementIntersecting(
      intersectingElement.current,
      () => {
        void fetchNextPage();
      }
    );
    return () => observer?.disconnect();
  }, [isFetchingNextPage, hasNextPage, fetchNextPage]);

  useEffect(() => {
    const newLastMessageUUID = data.pages[0].results[0]?.uuid;
    if (
      !messageViewRef.current ||
      newLastMessageUUID === lastMessageUUId.current
    )
      return;
    messageViewRef.current.scrollTop = messageViewRef.current.scrollHeight;
    lastMessageUUId.current = newLastMessageUUID;
  }, [data]);

  return (
    <div
      ref={messageViewRef}
      className="flex-1 flex flex-col-reverse gap-6 py-4 px-4 md:px-8 overflow-y-auto shrink-0"
    >
      {true && <TypingIndicator />}
      {messageGroups.map((messageGroup, index) => {
        if (messageGroup.type === "dateHeader")
          return (
            <p
              key={messageGroup.timestamp}
              className="mb-3 mt-8 text-xs text-center opacity-70"
            >
              {parseDateString({
                dateString: messageGroup.timestamp,
                fullDate: true,
              })}
            </p>
          );

        const isSentByMe = currentUser.id === messageGroup.userId;
        const sender_details = chatDetails.is_group
          ? chatDetails.group.mappedMembers.get(messageGroup.userId)
          : { username: isSentByMe ? "You" : chatDetails.friend.username };
        if (!sender_details) return null;

        return (
          <MessageGroup
            key={messageGroup.messages[0].uuid}
            intersectionRef={
              index === messageGroups.length - 1
                ? intersectingElement
                : undefined
            }
            {...messageGroup}
            sentByMe={isSentByMe}
            sender_detail={sender_details}
            isGroupMessage={chatDetails.is_group}
          />
        );
      })}
      {isFetchingNextPage && (
        <MessageLoading className="my-4 flex justify-center w-full" />
      )}
    </div>
  );
};

export default MessaageView;
