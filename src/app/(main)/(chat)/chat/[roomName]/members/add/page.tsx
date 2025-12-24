"use client";

import { FormDescription } from "@/components/form/form-sematics";
import SubmitBtn from "@/components/form/submit-btn";
import ProfilePicture from "@/components/profile-picture";
import SearchBar from "@/components/search-bar";
import { cn } from "@/lib/utils";
import { watchElementIntersecting } from "@/utils/helpers/client-helper";
import {
  addMemberMutationOption,
  chatQueryOption,
  friendsQueryOption,
} from "@/utils/queryOptions";
import { ErrorResponse, Friend } from "@/utils/types/server-response.type";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Check, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { redirect, usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

const SelectedUser = (props: Friend & { onClick: () => void }) => {
  return (
    <motion.div layout className="flex flex-col gap-2 max-w-20 items-center">
      <div className="relative shrink-0 size-12 rounded-full">
        <button
          className="absolute z-20 -top-0.5 -right-0.5 font-medium bg-white rounded-full p-0.5 shadow-md border border-black/10"
          type="button"
          onClick={props.onClick}
        >
          <X size={14} strokeWidth={2.5} />
        </button>
        <ProfilePicture
          ownerName={props.username}
          src={props.profile_picture}
          fill
          sizes="96px"
        />
      </div>
      <p className="text-sm opacity-80 line-clamp-1 wrap-anywhere">
        {props.username}
      </p>
    </motion.div>
  );
};

const Page = () => {
  const roomName = usePathname().split("/")[2];
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedUsersId, setSelectedUsersId] = useState<number[]>([]);

  const { mutate, error, isPending, isSuccess } = useMutation(
    addMemberMutationOption
  );

  const {
    data: friendQueryData,
    error: friendQueryError,
    isPending: isFriendQueryPending,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteQuery(friendsQueryOption(searchKeyword));
  const {
    data: roomQueryData,
    error: roomQueryError,
    isPending: isRoomQueryPending,
  } = useQuery(chatQueryOption(roomName));
  const friends = useMemo(() => {
    const friendsMap = new Map<number, Friend>();

    friendQueryData?.pages.forEach((response) =>
      response.results.forEach((friend) => friendsMap.set(friend.id, friend))
    );
    return friendsMap;
  }, [friendQueryData?.pages]);
  const intersectingElement = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (isFetchingNextPage || !hasNextPage || isFriendQueryPending) return;

    const observer = watchElementIntersecting(
      intersectingElement.current,
      () => {
        fetchNextPage();
      }
    );
    return () => observer?.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isFriendQueryPending]);

  if (isSuccess && roomQueryData) redirect(`/chat/${roomQueryData.name}`);

  const LIMIT = 5;

  if (!roomQueryData?.is_group) return <p>Invalid room</p>;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        mutate({
          roomName: roomQueryData.name,
          groupId: roomQueryData.group.id,
          memberIds: selectedUsersId,
        });
      }}
      className="p-4 flex flex-col gap-4 flex-1"
    >
      <SearchBar setSearchKeyword={setSearchKeyword} />
      <AnimatePresence>
        {selectedUsersId.length > 0 && (
          <motion.div
            layout
            initial={{ height: 0 }}
            animate={{ height: "" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
            key="selected-users-view"
            className="flex p-1 gap-2"
          >
            {selectedUsersId.map((userId) => {
              const friend = friends.get(userId);
              if (friend)
                return (
                  <SelectedUser
                    key={friend.id}
                    {...friend}
                    onClick={() =>
                      setSelectedUsersId((prev) =>
                        prev.filter(
                          (selectedUserId) => userId !== selectedUserId
                        )
                      )
                    }
                  />
                );
            })}
          </motion.div>
        )}
      </AnimatePresence>
      {error && (
        <p className="text-xs text-red-500">
          {isAxiosError<ErrorResponse>(error)
            ? error.response?.data.error
            : error.message}
        </p>
      )}
      <section className="flex flex-col gap-2 p-4 max-w-md flex-1 overflow-y-auto">
        <div className="mb-3">
          <h2 className="text-xl font-semibold -ml-4 ">Friends</h2>
          <FormDescription>Select friends to add to</FormDescription>
          <span className="text-sm">{" " + roomQueryData.group.name}</span>
        </div>

        {Array.from(friends.values()).map((friend, index) => {
          if (roomQueryData?.group?.mappedMembers.has(friend.id)) return;
          const isSelected = selectedUsersId.includes(friend.id);
          return (
            <button
              ref={
                friends.size - LIMIT - 1 === index ? intersectingElement : null
              }
              onClick={() => {
                if (selectedUsersId.includes(friend.id))
                  return setSelectedUsersId(
                    selectedUsersId.filter((id) => id !== friend.id)
                  );
                setSelectedUsersId([friend.id, ...selectedUsersId]);
              }}
              type="button"
              key={friend.id}
              className={cn(
                "flex gap-2 items-center w-full px-2 py-1 rounded-lg hover:bg-black/5 transition-all duration-200",
                {
                  "bg-theme/3!": isSelected,
                }
              )}
            >
              <div className="relative size-11 rounded-full">
                <ProfilePicture
                  ownerName={friend.username}
                  src={friend.profile_picture}
                  fill
                  sizes="88px"
                />
              </div>
              <p className="text-sm">{friend.username}</p>
              {isSelected && (
                <div className="p-0.5 rounded-full bg-theme text-white ml-auto">
                  <Check size={16} strokeWidth={3} />
                </div>
              )}
            </button>
          );
        })}
      </section>
      <SubmitBtn
        disabled={isPending || selectedUsersId.length <= 0}
        isSubmitting={isPending}
      >
        Add
      </SubmitBtn>
    </form>
  );
};

export default Page;
