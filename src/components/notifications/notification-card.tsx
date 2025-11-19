import Link from "next/link";

import ProfilePicture from "../profile-picture";

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
      className="bg-white border border-black/10 shadow-md p-2 rounded-lg max-w-2xs md:max-w-xs lg:max-w-sm mx-auto flex items-center gap-4"
    >
      <ProfilePicture
        ownerName={header}
        src={profilePictureURL}
        height={48}
        width={48}
        className="rounded-full shadow-md -my-6 object-cover"
      />
      <div className="flex flex-col justify-center ">
        <div className="flex gap-1` justify-between items-center">
          <h1 className="font-medium line-clamp-1">{header}</h1>
          {timestamp && <p className="text-xs text-blue-500">{timestamp}</p>}
        </div>
        <p className="opacity-75 text-sm line-clamp-1 lg:line-clamp-2">
          {description}
        </p>
      </div>
    </Link>
  );
};

export default NotificationCard;
