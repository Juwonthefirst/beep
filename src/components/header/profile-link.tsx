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
        isServerMedia={data?.profile_picture !== undefined}
        src={data?.profile_picture || "/default.webp"}
      />
    </Link>
  );
};

export default ProfileLink;
