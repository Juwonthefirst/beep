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
import { useEffect, useRef } from "react";
import MessageLoading from "./message-loading";

const MessaageView = ({ roomName }: { roomName: string }) => {
  const { data, isFetchingNextPage } = useSuspenseInfiniteQuery(
    messageQueryOption(roomName)
  );
  const { data: chatDetails } = useSuspenseQuery(chatQueryOption(roomName));
  const { data: currentUser } = useSuspenseQuery(currentUserQueryOption);
  const messageViewRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!messageViewRef.current) return;
    messageViewRef.current.scrollTop = messageViewRef.current.scrollHeight;
  }, [data]);

  return (
    <div
      ref={messageViewRef}
      className="flex flex-col-reverse gap-1 py-4 px-8 h-[calc(100dvh-104px-52px)] overflow-auto"
    >
      {data.pages.flatMap((response) =>
        response.results.map((message) => {
          const isSentByMe = currentUser.id === message.sender;
          const sender_details = chatDetails.is_group
            ? chatDetails.group.mappedMembers.get(message.sender)
            : { username: isSentByMe ? "You" : chatDetails.friend.username };
          if (!sender_details) return null;

          return (
            <MessageCard
              key={message.uuid}
              {...message}
              sentByMe={isSentByMe}
              sender_details={sender_details}
              isGroupMessage={chatDetails.is_group}
            />
          );
        })
      )}
      {isFetchingNextPage && <MessageLoading className="my-4" />}
    </div>
  );
};

export default MessaageView;
