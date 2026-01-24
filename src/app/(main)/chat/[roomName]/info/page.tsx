"use client";

import { useParams, useRouter } from "next/navigation";
import FriendInfo from "@/components/friends/friend-info";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import {
  chatQueryOption,
  leaveGroupMutationOption,
} from "@/utils/queryOptions";
import { Group } from "@/utils/types/server-response.type";
import Link from "next/link";
import { Dot, LoaderCircle, LogOut, UserPlus } from "lucide-react";
import ProfilePicture from "@/components/profile-picture";
import Menu from "@/components/menu";
import Popup from "@/components/popups/popup";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const GroupInfo = ({ group }: { group: Group }) => {
  const router = useRouter();

  const { mutate, error, status } = useMutation({
    ...leaveGroupMutationOption,
    onSuccess() {
      router.push("/");
    },
  });

  return (
    <>
      <section className="w-full  border border-neutral-200 rounded-xl whitespace-nowrap">
        <div className="flex items-center justify-between py-3 px-4">
          <div className="flex items-center">
            <h2 className="text-xl font-medium">Members</h2>
            <Dot size={12} />
            <p className="text-xs text-theme">{group.members.length} members</p>
          </div>

          <Link
            className="flex gap-2 text-sm"
            href={`/chat/${group.room_name}/members/add`}
          >
            <UserPlus className="text-theme" size={18} />
            <p className="hidden md:block">Add members</p>
          </Link>
        </div>
        <div className="max-h-108 overflow-y-auto bg-black/2">
          {group.members.map((member) => (
            <div
              className="flex items-center gap-3 border-y border-neutral-100 first:border-t-0 last:border-b-0 p-2"
              key={member.id}
            >
              <div className="relative size-10">
                <ProfilePicture
                  ownerName={member.username}
                  src={member.profile_picture}
                  fill
                  sizes="80px"
                />
              </div>
              <div className="flex items-center /flex-col gap-3 text-sm">
                <p>{member.username}</p>
              </div>

              <div className="ml-auto flex items-center gap-3">
                {member.role && (
                  <p
                    style={{ backgroundColor: member.role_hex }}
                    className="text-xs px-2 py-1 rounded-full text-white"
                  >
                    {member.role}
                  </p>
                )}
                <Menu className="*:py-1" iconSize={20}>
                  <button type="button">Kick out</button>
                </Menu>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Popup
        trigger={
          <button
            className="text-red-500 flex items-center gap-1.5  p-6 border-t border-neutral-200"
            type="button"
          >
            <LogOut size={22} />
            Leave group
          </button>
        }
      >
        <AlertDialogHeader>
          <AlertDialogTitle>Leave {group.name}?</AlertDialogTitle>
          <AlertDialogDescription>
            You may lose important messages and role if you leave {group.name}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 hover:bg-red-600"
            onClick={() => {
              mutate({ groupId: group.id });
            }}
            disabled={status === "pending"}
          >
            {status === "pending" ? (
              <LoaderCircle size={18} className="animate-spin" />
            ) : (
              "Leave"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </Popup>
    </>
  );
};

const Page = () => {
  const { roomName } = useParams<{ roomName: string }>();
  const { data } = useSuspenseQuery(chatQueryOption(roomName));

  return (
    <section className="flex flex-col flex-1 pt-10 gap-8 p-6 h-full overflow-y-auto">
      <FriendInfo
        room_name={roomName}
        avatar={data.is_group ? data.group.avatar : data.friend.profile_picture}
        description={data.group?.description}
        username={data.is_group ? data.group.name : data.friend.username}
      />
      {data.is_group ? <GroupInfo group={data.group} /> : null}
    </section>
  );
};

export default Page;
