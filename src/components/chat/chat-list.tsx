"use client";

import { chatListQueryOption } from "@/utils/queryOptions";
import {
  useInfiniteQuery,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";

const ChatList = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(chatListQueryOption);
  return <div>chat-list</div>;
};

export default ChatList;
