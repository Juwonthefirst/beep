import { parseDateString } from "@/utils/helpers/client-helper";
import ProfilePicture from "../profile-picture";
import {
  GroupChatRoom,
  UserChatRoom,
} from "@/utils/types/server-response.type";
import Link from "next/link";
import { RefObject } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

export const ChatPreviewSkeleton = () => (
  <div className="flex items-center gap-4 p-2">
    <Skeleton className="min-w-12 min-h-12 rounded-full " />
    <div className="flex gap-2 flex-col justify-center w-full">
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-5" />
      </div>
      <div className="flex justify-between items-center">
        <Skeleton className="h-3.5 w-full" />
      </div>
    </div>
  </div>
);

const ChatPreview = ({
  friend,
  name,
  is_group,
  group,
  last_message,
  unread_message_count,
  ref,
  isCurrentRoom,
  created_at,
}: (UserChatRoom | GroupChatRoom) & {
  ref?: RefObject<HTMLAnchorElement | null>;
  isCurrentRoom: boolean;
}) => {
  const chatParentName = is_group ? group.name : friend.username;
  const chatAvatar = is_group ? group.avatar : friend.profile_picture;
  const isRoomEmpty = !(last_message.room && last_message.sender);

  return (
    <Link
      href={`/chat/${name}`}
      ref={ref}
      className={cn(
        "hover:bg-black/3 p-2 rounded-lg  flex items-center gap-4",
        { "bg-black/5!": isCurrentRoom }
      )}
    >
      <div className="relative min-w-12 min-h-12 rounded-full shadow-md object-cover">
        <ProfilePicture
          ownerName={chatParentName}
          src={chatAvatar}
          fill
          sizes="96px"
        />
      </div>

      <div className="flex flex-col gap-1 justify-center w-full">
        <div className="flex  justify-between items-center">
          <h1 className="font-medium line-clamp-1">{chatParentName}</h1>
          {
            <p
              className={cn("text-xs opacity-60", {
                " text-theme": unread_message_count > 0,
              })}
            >
              {parseDateString(
                isRoomEmpty ? created_at : last_message.timestamp
              )}
            </p>
          }
        </div>
        <div className="flex justify-between items-center">
          <p className="opacity-70 text-sm line-clamp-1">
            {isRoomEmpty
              ? `Start a chat with ${chatParentName}`
              : is_group
              ? `${last_message.sender}: ${last_message.body}`
              : last_message.body}
          </p>
          {unread_message_count > 0 && (
            <p className="text-xs bg-theme rounded-full w-5 h-5 text-white items-center justify-center flex ">
              {unread_message_count}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ChatPreview;
