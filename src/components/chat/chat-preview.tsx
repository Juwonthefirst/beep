import { parseDateString } from "@/utils/helpers/client-helper";
import ProfilePicture from "../profile-picture";
import {
  GroupChatRoom,
  UserChatRoom,
} from "@/utils/types/server-response.type";
import Link from "next/link";
import { RefObject } from "react";
import { cn } from "@/lib/utils";

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

  return (
    <Link
      href={`/chat/${name}`}
      ref={ref}
      className={cn(
        "hover:bg-black/3 p-2 rounded-lg  flex items-center gap-3 transition-all duration-200",
        { "bg-black/5!": isCurrentRoom },
      )}
    >
      <div className="relative size-13 rounded-full shrink-0">
        <ProfilePicture
          ownerName={chatParentName}
          src={chatAvatar}
          fill
          sizes="104px"
        />
      </div>

      <div className="flex flex-col gap-1 justify-center w-full">
        <div className="flex  justify-between items-center">
          <h1 className="font-medium line-clamp-1">{chatParentName}</h1>
          {
            <p
              className={cn("md:hidden lg:block text-xs opacity-60", {
                " text-theme": unread_message_count > 0,
              })}
            >
              {parseDateString({
                dateString: !last_message
                  ? created_at
                  : last_message.created_at,
              })}
            </p>
          }
        </div>
        <div className="flex justify-between items-center">
          <p className="opacity-70 text-sm line-clamp-1 wrap-anywhere ">
            {!last_message
              ? `Start a chat with ${chatParentName}`
              : is_group
                ? `${last_message.sender_username}:  ${last_message.body}`
                : last_message.body}
          </p>
          {unread_message_count > 0 && (
            <p className="text-xs bg-theme rounded-full shrink-0 w-5 h-5 text-white items-center justify-center flex ">
              {unread_message_count}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ChatPreview;
