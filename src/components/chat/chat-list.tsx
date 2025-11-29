"use client";

import { chatListQueryOption } from "@/utils/queryOptions";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import ChatPreview from "./chat-preview";
import { watchElementIntersecting } from "@/utils/helpers/client-helper";
import ChatListSkeleton from "./chat-list-skeleton";
import NoChatRoom from "./no-chat-room";
import { isAxiosError } from "axios";
import { AuthErrorResponse } from "@/utils/types/server-response.type";
import { usePathname } from "next/navigation";

const ChatList = () => {
  const {
    data,
    error,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(chatListQueryOption);
  const intersectingElement = useRef<HTMLAnchorElement | null>(null);
  const pathName = usePathname();
  const currentRoom = pathName.split("/").at(-1);
  const PAGE_SIZE = 20;
  const LIMIT = 5;

  useEffect(() => {
    if (isFetchingNextPage || !hasNextPage || isPending) return;

    const observer = watchElementIntersecting(
      intersectingElement.current,
      () => {
        void fetchNextPage();
      }
    );
    return () => observer?.disconnect();
  }, [isFetchingNextPage, hasNextPage, fetchNextPage, isPending]);

  if (isError && isAxiosError<AuthErrorResponse>(error))
    return <p>{error.response?.data.error}</p>;

  return (
    <div className="flex flex-col gap-4 px-1">
      {data && data.pages[0].results.length === 0 && <NoChatRoom />}
      {data &&
        data.pages.flatMap((response, currentPageParamIndex) =>
          response.results.map((chatRoom, index) => (
            <ChatPreview
              key={chatRoom.id}
              ref={
                data.pageParams.length * PAGE_SIZE - LIMIT ===
                currentPageParamIndex * PAGE_SIZE + index
                  ? intersectingElement
                  : undefined
              }
              {...chatRoom}
              isCurrentRoom={currentRoom === chatRoom.name}
            />
          ))
        )}

      {(isPending || isFetchingNextPage) && <ChatListSkeleton />}
    </div>
  );
};

export default ChatList;
