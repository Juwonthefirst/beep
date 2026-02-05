import { cn } from "@/lib/utils";
import { BaseUser } from "@/utils/types/server-response.type";
import { RefObject } from "react";
import ProfilePicture from "../profile-picture";
import Link from "next/link";
import SendFriendRequestBtn from "./buttons/send-friend-request-btn";

const FriendRequestCard = ({
  id,
  username,
  profile_picture,
  is_followed_by_me,
  is_following_me,
  ref,
}: BaseUser & { ref?: RefObject<HTMLDivElement | null> }) => {
  return (
    <div
      key={id}
      className={cn(
        "flex items-center p-2 rounded-lg transition-all duration-200 hover:bg-black/3 md:px-4 ",
      )}
      ref={ref}
    >
      <Link
        className="flex items-center gap-3 text-sm"
        href={`/users/${username}`}
      >
        <div className="relative shrink-0 size-12">
          <ProfilePicture
            ownerName={username}
            src={profile_picture}
            fill
            sizes="96px"
          />
        </div>
        <p className="font-medium line-clamp-1">{username}</p>
      </Link>

      <div className="flex gap-2 text-theme *:not-disabled:hover:scale-110 *:not-disabled:hover:bg-theme/10 *:rounded-full *:p-2 ml-auto md:mr-24">
        <SendFriendRequestBtn
          userId={id}
          is_followed_by_me={is_followed_by_me}
          is_following_me={is_following_me}
        />
      </div>
    </div>
  );
};

export default FriendRequestCard;
