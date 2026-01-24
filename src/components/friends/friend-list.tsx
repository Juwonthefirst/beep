"use client";

import { friendListQueryOption } from "@/utils/queryOptions";
import { useRef } from "react";
import { useParams } from "next/navigation";
import InifinteDataView from "../infinite-data-view";
import FriendCard from "./friend-card";
import FriendListSkeleton from "./friend-list-skeleton";
import NoFriendsFallback from "./no-friends-fallback";
import useSearchParams from "@/hooks/useSearchParams.hook";

const FriendList = () => {
  const intersectingElementRef = useRef<HTMLDivElement | null>(null);
  const { username } = useParams<{ username: string }>();
  const { searchParams } = useSearchParams();

  return (
    <InifinteDataView
      className="relative flex flex-col gap-2 px-1"
      queryOption={friendListQueryOption(searchParams.search)}
      triggerElementRef={intersectingElementRef}
      emptyFallback={<NoFriendsFallback />}
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
  );
};

export default FriendList;
