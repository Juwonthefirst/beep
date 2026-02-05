"use client";

import {
  friendListQueryOption,
  friendRequestListQueryOption,
  sentFriendRequestListQueryOption,
} from "@/utils/queryOptions";
import { useRef, useState } from "react";
import { useParams } from "next/navigation";
import InifinteDataView from "../infinite-data-view";
import FriendCard from "./friend-card";
import FriendListSkeleton from "./friend-list-skeleton";
import NoFriendsFallback from "./no-friends-fallback";
import useSearchParams from "@/hooks/useSearchParams.hook";
import FriendRequestCard from "./friend-request-card";
import { FriendListType } from "@/utils/types/client.type";

const FriendList = () => {
  const intersectingElementRef = useRef<HTMLDivElement | null>(null);
  const { username } = useParams<{ username: string }>();
  const { searchParams } = useSearchParams();
  const [currentFriendListType, setCurrentFriendListType] =
    useState<FriendListType>("friend");

  return (
    <>
      <div className="flex gap-2 px-2 *:border *:border-black/10 *:px-2 *:py-1 *:text-xs *:font-medium *:rounded-md *:data-[iscurrent=true]:bg-theme *:data-[iscurrent=true]:text-white *:data-[iscurrent=true]:border-white/10 *:transition-all">
        <button
          data-iscurrent={currentFriendListType === "friend"}
          onClick={() => {
            setCurrentFriendListType("friend");
          }}
        >
          Friends
        </button>
        <button
          data-iscurrent={currentFriendListType === "friend request"}
          onClick={() => {
            setCurrentFriendListType("friend request");
          }}
        >
          Friend request
        </button>
        <button
          data-iscurrent={currentFriendListType === "sent request"}
          onClick={() => {
            setCurrentFriendListType("sent request");
          }}
        >
          Sent request
        </button>
      </div>
      {currentFriendListType === "friend" ? (
        <InifinteDataView
          className="relative flex flex-col gap-2 px-1"
          queryOption={friendListQueryOption(searchParams.search)}
          triggerElementRef={intersectingElementRef}
          emptyFallback={<NoFriendsFallback friendListType="friend" />}
          loadingFallback={<FriendListSkeleton />}
        >
          {(friend, isTriggerElement) => (
            <FriendCard
              key={friend.id}
              ref={isTriggerElement ? intersectingElementRef : undefined}
              {...friend}
              isCurrentFriend={username === friend.username}
            />
          )}
        </InifinteDataView>
      ) : currentFriendListType === "friend request" ? (
        <InifinteDataView
          className="relative flex flex-col gap-2 px-1"
          queryOption={friendRequestListQueryOption(searchParams.search)}
          triggerElementRef={intersectingElementRef}
          emptyFallback={<NoFriendsFallback friendListType="friend request" />}
          loadingFallback={<FriendListSkeleton />}
        >
          {(friend, isTriggerElement) => (
            <FriendRequestCard
              key={friend.id}
              ref={isTriggerElement ? intersectingElementRef : undefined}
              {...friend}
            />
          )}
        </InifinteDataView>
      ) : (
        <InifinteDataView
          className="relative flex flex-col gap-2 px-1"
          queryOption={sentFriendRequestListQueryOption(searchParams.search)}
          triggerElementRef={intersectingElementRef}
          emptyFallback={<NoFriendsFallback friendListType="sent request" />}
          loadingFallback={<FriendListSkeleton />}
        >
          {(friend, isTriggerElement) => (
            <FriendRequestCard
              key={friend.id}
              ref={isTriggerElement ? intersectingElementRef : undefined}
              {...friend}
            />
          )}
        </InifinteDataView>
      )}
    </>
  );
};

export default FriendList;
