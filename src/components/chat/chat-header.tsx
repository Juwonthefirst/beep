"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import ProfilePicture from "../profile-picture";
import { chatQueryOption } from "@/utils/queryOptions";
import { cn } from "@/lib/utils";
import { parseDateString } from "@/utils/helpers/client-helper";
import { EllipsisVertical, Phone, Video } from "lucide-react";
import useSocketState from "@/hooks/useSocketState.hook";

const ChatHeader = ({ roomName }: { roomName: string }) => {
  const { data } = useSuspenseQuery(chatQueryOption(roomName));
  const socketState = useSocketState();
  const mediaPath = data.is_group
    ? data.group.avatar
    : data.friend.profile_picture;

  const extraIconsSize = 20;

  return (
    <header className="flex items-center h-12 px-6 bg-neutral-50 gap-4 w-full ">
      <div className="relative w-10 h-10 rounded-full">
        <ProfilePicture
          src={mediaPath}
          ownerName={data.is_group ? data.group.name : data.friend.username}
          fill
          className="shadow-md"
          sizes="80px"
        />
      </div>
      <div className="flex flex-col -gap-1 max-w-64 text-ellipsis">
        <p className="font-medium ">
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
              : `last seen: ${parseDateString({
                  dateString: data.friend.last_online,
                  fullDate: true,
                })}`}
          </p>
        )}
      </div>
      {socketState.is_connecting && (
        <p className="text-sm mx-auto">connecting</p>
      )}

      <div className="flex ml-auto gap-6 items-center px-4 *:p-2 *:hover:bg-theme/5 *:hover:text-theme *:rounded-full">
        <button>
          <Phone size={extraIconsSize} />
        </button>
        <button>
          <Video size={extraIconsSize} />
        </button>
        <button>
          <EllipsisVertical size={extraIconsSize} />
        </button>
      </div>
    </header>
  );
};

export default ChatHeader;
