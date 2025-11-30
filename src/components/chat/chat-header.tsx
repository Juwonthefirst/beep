"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import ProfilePicture from "../profile-picture";
import { chatQueryOption } from "@/utils/queryOptions";
import { cn } from "@/lib/utils";
import { parseDateString } from "@/utils/helpers/client-helper";
import { EllipsisVertical, LoaderCircle, Phone, Video } from "lucide-react";
import useSocketState from "@/hooks/useSocketState.hook";
import { Skeleton } from "../ui/skeleton";
import useChatSocket from "@/hooks/useChatSocket.hook";

const extraIconsSize = 22;

export const ChatHeaderSkeleton = () => (
  <div className="flex items-center h-14 px-4 md:px-6 bg-neutral-50 gap-4 w-full">
    <Skeleton className="min-w-10 min-h-10 rounded-full" />
    <div className="flex flex-col gap-1 w-full max-w-64">
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-3 w-1/3" />
    </div>
    <div className="flex ml-auto gap-3 md:gap-4 lg:gap-6 items-center *:p-2">
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
  </div>
);

const ChatHeader = ({ roomName }: { roomName: string }) => {
  const { data } = useSuspenseQuery(chatQueryOption(roomName));
  const socketState = useSocketState();
  const chatSocket = useChatSocket(roomName);
  const mediaPath = data.is_group
    ? data.group.avatar
    : data.friend.profile_picture;

  return (
    <header className="flex items-center shrink-0 h-14 px-4 md:px-6 bg-neutral-50 gap-4 w-full ">
      <div className="relative min-w-10 min-h-10 rounded-full">
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
            {chatSocket.typingUsers.includes(data.friend.username)
              ? "typing..."
              : data.friend.is_online
              ? "online"
              : `last seen: ${parseDateString({
                  dateString: data.friend.last_online,
                  fullDate: true,
                })}`}
          </p>
        )}
      </div>
      {socketState.is_connecting && (
        <div className="flex items-center gap-2">
          <LoaderCircle className="animate-spin" size={18} />
          <p className="text-sm mx-auto">connecting</p>
        </div>
      )}

      <div className="flex ml-auto gap-3 md:gap-4 lg:gap-6 items-center *:p-2 *:hover:bg-theme/5 *:hover:text-theme *:rounded-full">
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
