import ProfilePicture from "../profile-picture";
import { MessageCircle } from "lucide-react";
import Link from "next/link";
import CallButtons from "../call/call-buttons";
import { CallerInfo } from "@/utils/types/client.type";
import { CurrentRoomNameContext } from "../providers/chatroom-state.provider";
import ExpandableText from "../expandable-text";
import { cn } from "@/lib/utils";
import { parseDateString } from "@/utils/helpers/client-helper";

interface Props {
  avatar?: string;
  username: string;
  description?: string;
  room_name: string;
  profile_picture?: string;
  is_online?: boolean;
  last_online?: string;
}

const FriendInfo = ({
  avatar,
  username,
  description,
  room_name,
  profile_picture,
  is_online,
  last_online,
}: Props) => {
  const callerInfo: CallerInfo = {
    username,
    avatar: avatar || profile_picture || "",
  };

  return (
    <div className="flex flex-col self-center items-center gap-4">
      <div className="relative size-36">
        <ProfilePicture
          ownerName={username}
          src={callerInfo.avatar}
          fill
          sizes="288px"
        />
      </div>
      <div className="flex flex-col gap-3 mb-2 items-center">
        <p className="font-medium text-lg ">{username}</p>
        {last_online && (
          <p className={cn("text-xs", { "text-theme": is_online })}>
            {is_online
              ? "online"
              : `last seen at: ${parseDateString({
                  dateString: last_online,
                  fullDate: true,
                })}`}
          </p>
        )}
        {description && (
          <ExpandableText
            className="text-center text-sm wrap-break-word w-64 -mt-4"
            paragraphClassName="opacity-70"
          >
            {description}
          </ExpandableText>
        )}
      </div>
      <div className="flex gap-4 items-center  *:flex  *:items-center *:p-2 *:gap-2 *:border-[1.5px] *:border-theme/60 *:text-sm *:text-theme *:rounded-md *:hover:ring-4 *:hover:ring-theme/10">
        <Link href={`/chat/${room_name}`} className="" type="button">
          <MessageCircle size={22} />
        </Link>
        <CurrentRoomNameContext value={room_name}>
          <CallButtons iconSize={22} callerInfo={callerInfo} />
        </CurrentRoomNameContext>
      </div>
    </div>
  );
};

export default FriendInfo;
