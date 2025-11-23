"use client";

import {
  currentUserQueryOption,
  messageQueryOption,
} from "@/utils/queryOptions";
import {
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import MessageCard from "./message-card";
import { mockMessages } from "@/utils/mockData";
import { useEffect, useRef } from "react";

const MessaageView = ({ roomName }: { roomName: string }) => {
  const { data } = useSuspenseInfiniteQuery(messageQueryOption(roomName));
  const currentUserData = useSuspenseQuery(currentUserQueryOption);
  const messageViewRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!messageViewRef.current) return;
    messageViewRef.current.scrollTop = messageViewRef.current.scrollHeight;
  }, [data]);

  return (
    <div
      ref={messageViewRef}
      className="flex flex-col gap-1 py-4 px-8 h-[calc(100vh-104px)] overflow-auto"
    >
      {data.pages.flatMap((response) =>
        mockMessages.map((message) => (
          <MessageCard
            key={message.uuid}
            {...message}
            sentByMe={currentUserData.data.id === message.sender}
          />
        ))
      )}
    </div>
  );
};

export default MessaageView;
