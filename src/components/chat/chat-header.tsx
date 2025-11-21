"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import ProfilePicture from "../profile-picture";
import { chatQueryOption } from "@/utils/queryOptions";
import { cn } from "@/lib/utils";
import { parseDateString } from "@/utils/helpers/client-helper";

const ChatHeader = ({ roomName }: { roomName: string }) => {
  const { data } = useSuspenseQuery(chatQueryOption(roomName));
  const mediaPath = data.is_group
    ? data.group.avatar
    : data.friend.profile_picture;

  return (
    <header className="flex items-center h-12 px-6 bg-white gap-4">
      <div className="relative w-10 h-10 rounded-full">
        <ProfilePicture
          src={mediaPath}
          ownerName={data.is_group ? data.group.name : data.friend.username}
          fill
          className="shadow-md"
          sizes="80px"
        />
      </div>
      <div className="flex flex-col -gap-1 ">
        <p className="font-medium">
          {data.is_group ? data.group.avatar : data.friend.username}
        </p>
        {!data.is_group && (
          <p
            className={cn("text-xs opacity-70", {
              "text-theme text-sm": data.friend.is_online,
            })}
          >
            {data.friend.is_online
              ? "online"
              : `last seen: ${parseDateString(data.friend.last_online)}`}
          </p>
        )}
      </div>
    </header>
  );
};

export default ChatHeader;
