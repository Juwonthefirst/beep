import { BaseFriend } from "@/utils/types/server-response.type";
import { RefObject } from "react";
import ProfilePicture from "../profile-picture";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import CallButtons from "../call/call-buttons";
import { CurrentRoomNameContext } from "../providers/chatroom-state.provider";
import { CallerInfo } from "@/utils/types/client.type";
import { cn } from "@/lib/utils";

interface Props extends BaseFriend {
  ref?: RefObject<HTMLDivElement | null>;
  isCurrentFriend: boolean;
}

const FriendCard = ({
  ref,
  username,
  profile_picture,
  room_name,
  isCurrentFriend,
}: Props) => {
  const callerInfo: CallerInfo = { username, avatar: profile_picture };
  if (!room_name) return;

  return (
    <div
      className={cn(
        "flex items-center p-2 rounded-lg transition-all duration-200 hover:bg-black/3",
        {
          "bg-black/5!": isCurrentFriend,
        },
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
        <p className="font-medium">{username}</p>
      </Link>

      <div className="flex gap-2 text-theme *:hover:scale-110 *:hover:bg-theme/10 *:rounded-full *:p-2   ml-auto">
        <Link href={`/chat/${room_name}`}>
          <MessageCircle size={20} />
        </Link>
        <CurrentRoomNameContext value={room_name}>
          <CallButtons iconSize={20} callerInfo={callerInfo} />
        </CurrentRoomNameContext>
      </div>
    </div>
  );
};

export default FriendCard;
