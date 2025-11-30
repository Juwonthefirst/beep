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
import MessageCard from "./message-card";
import { useEffect, useMemo, useRef } from "react";
import MessageLoading from "./message-loading";
import {
  createMessageGroups,
  watchElementIntersecting,
} from "@/utils/helpers/client-helper";
import { UUID } from "crypto";
import MessageGroup from "./message-group";

const MessaageView = ({ roomName }: { roomName: string }) => {
  const { data, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useSuspenseInfiniteQuery(messageQueryOption(roomName));
  const { data: chatDetails } = useSuspenseQuery(chatQueryOption(roomName));
  const { data: currentUser } = useSuspenseQuery(currentUserQueryOption);
  const messageViewRef = useRef<HTMLDivElement | null>(null);
  const lastMessageUUId = useRef<UUID>(null);
  const intersectingElement = useRef<HTMLDivElement | null>(null);
  const PAGE_SIZE = 50;
  const LIMIT = 5;

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
    const newLastMessageUUID = data.pages[0].results[0].uuid;
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
      className="flex flex-col-reverse gap-4 py-4 px-8 overflow-auto"
    >
      {messageGroups.map((messageGroup, index) => {
        const isSentByMe = currentUser.id === messageGroup.userId;
        const sender_details = chatDetails.is_group
          ? chatDetails.group.mappedMembers.get(messageGroup.userId)
          : { username: isSentByMe ? "You" : chatDetails.friend.username };
        if (!sender_details) return null;

        return (
          <MessageGroup
            key={messageGroup.messages[0].uuid}
            intersectionRef={index === 0 ? intersectingElement : undefined}
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
