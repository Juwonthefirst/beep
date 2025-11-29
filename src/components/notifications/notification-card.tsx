import Link from "next/link";

import ProfilePicture from "../profile-picture";
import { parseDateString } from "@/utils/helpers/client-helper";

interface Props {
  toastId: string | number;
  header: string;
  profilePictureURL: string;
  description: string;
  notificationURL: string;
  timestamp?: string;
}

const NotificationCard = ({
  header,
  description,
  notificationURL,
  timestamp,
  profilePictureURL,
}: Props) => {
  return (
    <Link
      href={notificationURL}
      className="bg-white border border-black/10 shadow-lg p-2 rounded-lg w-2xs md:w-xs lg:w-sm mx-auto flex items-center gap-4"
    >
      <ProfilePicture
        ownerName={header}
        src={profilePictureURL}
        height={48}
        width={48}
        className="rounded-full shadow-md -my-2 object-cover"
      />

      <div className="flex flex-col justify-center w-full">
        <div className="flex gap-1 justify-between items-center">
          <h1 className="font-medium line-clamp-1">{header}</h1>
          {timestamp && (
            <p className="text-xs text-theme">
              {parseDateString({ dateString: timestamp })}
            </p>
          )}
        </div>
        <p className="opacity-75 text-sm line-clamp-1 lg:line-clamp-2">
          {description}
        </p>
      </div>
    </Link>
  );
};

export default NotificationCard;
