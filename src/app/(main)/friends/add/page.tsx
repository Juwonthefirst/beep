"use client";

import FriendListSkeleton from "@/components/friends/friend-list-skeleton";
import FriendRequestCard from "@/components/friends/friend-request-card";
import InifinteDataView from "@/components/infinite-data-view";
import SearchBar from "@/components/search-bar";
import { usersQueryOption } from "@/utils/queryOptions";
import { useRef, useState } from "react";

const Page = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const loadMoreTriggerElementRef = useRef<HTMLDivElement | null>(null);
  return (
    <section className="p-4 flex flex-col gap-8">
      <SearchBar
        intialValue={searchKeyword}
        setSearchKeyword={setSearchKeyword}
      />
      <InifinteDataView
        className="flex flex-col gap-2"
        queryOption={usersQueryOption(searchKeyword)}
        emptyFallback={<p></p>}
        loadingFallback={<FriendListSkeleton />}
        triggerElementRef={loadMoreTriggerElementRef}
      >
        {(user, isTriggerElement) => (
          <FriendRequestCard
            key={user.id}
            {...user}
            ref={isTriggerElement ? loadMoreTriggerElementRef : undefined}
          />
        )}
      </InifinteDataView>
    </section>
  );
};

export default Page;
