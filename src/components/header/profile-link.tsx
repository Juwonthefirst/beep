"use client";
import { useQuery } from "@tanstack/react-query";

import Link from "next/link";
import ProfilePicture from "../profile-picture";
import { currentUserQueryOption } from "@/utils/queryOptions";

const ProfileLink = () => {
  const { data } = useQuery(currentUserQueryOption);
  return (
    <Link className="relative block w-8 h-8" href="/profile">
      <ProfilePicture
        fill
        sizes="96px"
        ownerName="Your"
        src={
          data?.profile_picture
            ? process.env.NEXT_PUBLIC_MEDIA_URL! + data.profile_picture
            : "/default.webp"
        }
      />
    </Link>
  );
};

export default ProfileLink;
