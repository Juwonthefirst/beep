import ProfilePicture from "../profile-picture";
import { MessageCircle } from "lucide-react";
import Link from "next/link";
import CallButtons from "../call/call-buttons";
import { CallerInfo } from "@/utils/types/client.type";
import { CurrentRoomNameContext } from "../providers/chatroom-state.provider";
import ExpandableText from "./expandable-text";

interface Props {
  avatar: string;
  username: string;
  roomName: string;
  description?: string;
}

const FriendInfo = ({ avatar, username, description, roomName }: Props) => {
  const callerInfo: CallerInfo = { username, avatar };

  return (
    <div className="flex flex-col self-center items-center gap-4">
      <div className="relative size-36">
        <ProfilePicture ownerName={username} src={avatar} fill sizes="288px" />
      </div>
      <p className="font-medium text-lg ">{username}</p>
      {description && (
        <ExpandableText
          className="text-center text-sm wrap-break-word w-64 -mt-4 mb-2"
          paragraphClassName="opacity-70"
        >
          {description}
        </ExpandableText>
      )}
      <div className="flex gap-4 items-center  *:flex  *:items-center *:p-2 *:gap-2 *:border-[1.5px] *:border-theme/60 *:text-sm *:text-theme *:rounded-md *:hover:ring-4 *:hover:ring-theme/10">
        <Link href={`/chat/${roomName}`} className="" type="button">
          <MessageCircle size={22} />
        </Link>
        <CurrentRoomNameContext value={roomName}>
          <CallButtons iconSize={22} callerInfo={callerInfo} />
        </CurrentRoomNameContext>
      </div>
    </div>
  );
};

export default FriendInfo;
