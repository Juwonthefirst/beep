"use client";
import ProfilePicture from "@/components/profile-picture";
import SearchBar from "@/components/search-bar";
import { cn } from "@/lib/utils";
import {
  addMemberMutationOption,
  chatQueryOption,
  friendsQueryOption,
} from "@/utils/queryOptions";
import { Friend } from "@/utils/types/server-response.type";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { Check, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

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
  const { mutate, error, isPending } = useMutation(addMemberMutationOption);
  const friendQuery = useInfiniteQuery(friendsQueryOption);
  const roomQuery = useQuery(chatQueryOption(roomName));
  const [selectedUsersId, setSelectedUsersId] = useState<number[]>([2, 4]);
  const friends = useMemo(() => {
    const friendsMap = new Map<number, Friend>();

    friendQuery.data?.pages.forEach((response) =>
      response.results.forEach((friend) => friendsMap.set(friend.id, friend))
    );
    return friendsMap;
  }, [friendQuery.data?.pages]);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
      }}
      className="px-4 py-2 flex flex-col gap-4 flex-1"
    >
      <SearchBar />
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
            {selectedUsersId.values().map((userId) => {
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
      <section className="flex flex-col gap-2 p-4 max-w-md">
        <h2 className="text-xl font-semibold -ml-4 mb-2">Friends</h2>
        {friends.values().map((friend) => {
          if (roomQuery.data?.group?.mappedMembers.has(friend.id)) return;
          const isSelected = selectedUsersId.includes(friend.id);
          return (
            <button
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
    </form>
  );
};

export default Page;
