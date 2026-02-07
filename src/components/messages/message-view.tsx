"use client";
import {
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { use, useEffect, useMemo, useRef } from "react";
import { UUID } from "crypto";

import {
  chatQueryOption,
  currentUserQueryOption,
  messageQueryOption,
} from "@/utils/queryOptions";

import MessageLoading from "./message-loading";
import {
  createMessageGroups,
  watchElementIntersecting,
} from "@/utils/helpers/client-helper";
import MessageGroup from "./message-group";
import TypingIndicator from "./typing-indicator";
import { CurrentRoomNameContext } from "../providers/chatroom-state.provider";

const MessaageView = () => {
  const roomName = use(CurrentRoomNameContext);
  const { data, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useSuspenseInfiniteQuery(messageQueryOption(roomName));
  const { data: chatDetails } = useSuspenseQuery(chatQueryOption(roomName));
  const { data: currentUser } = useSuspenseQuery(currentUserQueryOption);
  const messageViewRef = useRef<HTMLDivElement | null>(null);
  const lastMessageUUId = useRef<UUID>(null);
  const intersectingElement = useRef<HTMLDivElement | null>(null);

  const messageGroups = useMemo(
    () =>
      createMessageGroups(
        data.pages.flatMap((response) => response.results),
        currentUser.id,
      ),
    [data, currentUser],
  );

  useEffect(() => {
    if (isFetchingNextPage || !hasNextPage) return;

    const observer = watchElementIntersecting(
      intersectingElement.current,
      () => {
        void fetchNextPage();
      },
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
      className="flex-1 flex flex-col-reverse gap-6 p-4 md:px-6 overflow-y-auto"
    >
      <TypingIndicator />
      {messageGroups.map((messageGroup, index) => {
        const isSentByMe = currentUser.id === messageGroup.userId;
        const sender_details = chatDetails.is_group
          ? chatDetails.group.mappedMembers.get(messageGroup.userId)
          : null;
        if (sender_details === undefined) return null;

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
