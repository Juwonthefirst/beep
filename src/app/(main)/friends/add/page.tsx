"use client";

import FriendListSkeleton from "@/components/friends/friend-list-skeleton";
import InifinteDataView from "@/components/infinite-data-view";
import ProfilePicture from "@/components/profile-picture";
import SearchBar from "@/components/search-bar";
import { cn } from "@/lib/utils";
import {
  sendFriendRequestMutationOption,
  usersQueryOption,
} from "@/utils/queryOptions";
import { LoaderCircle, UserCheck, UserPlus, Users } from "lucide-react";
import Link from "next/link";
import { RefObject, useRef, useState } from "react";
import type { BaseUser } from "@/utils/types/server-response.type";
import { useMutation } from "@tanstack/react-query";
import ErrorPopup from "@/components/popups/error-popup";

const User = ({
  id,
  username,
  profile_picture,
  is_followed_by_me,
  is_following_me,
  ref,
}: BaseUser & { ref: RefObject<HTMLDivElement | null> | null }) => {
  const { mutate, error, status, reset } = useMutation(
    sendFriendRequestMutationOption,
  );
  const isFriend = is_following_me && is_followed_by_me;

  const Icon = isFriend
    ? Users
    : is_followed_by_me || status === "success"
      ? UserCheck
      : UserPlus;

  return (
    <div
      key={id}
      className={cn(
        "flex items-center p-2 rounded-lg transition-all duration-200 hover:bg-black/3 md:px-4 ",
      )}
      ref={ref}
    >
      <Link
        className="flex items-center gap-3 text-sm"
        href={`/users/${username}`}
      >
        <div className="relative size-12">
          <ProfilePicture
            ownerName={username}
            src={profile_picture}
            fill
            sizes="96px"
          />
        </div>
        <p className="font-medium line-clamp-1">{username}</p>
      </Link>

      <div className="flex gap-2 text-theme *:not-disabled:hover:scale-110 *:not-disabled:hover:bg-theme/10 *:rounded-full *:p-2 ml-auto md:mr-24">
        <button
          className={cn(
            "disabled:opacity-70 ",
            status === "pending" && "cursor-wait",
          )}
          type="button"
          onClick={() => {
            mutate({ userId: id });
          }}
          disabled={status === "pending" || isFriend || is_followed_by_me}
        >
          {status === "pending" ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <Icon size={20} />
          )}
        </button>
      </div>
      <ErrorPopup
        error={error}
        clearError={() => {
          reset();
        }}
      />
    </div>
  );
};

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
          <User
            key={user.id}
            {...user}
            ref={isTriggerElement ? loadMoreTriggerElementRef : null}
          />
        )}
      </InifinteDataView>
    </section>
  );
};

export default Page;
