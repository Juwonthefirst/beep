"use client";
import { useQuery } from "@tanstack/react-query";

import Link from "next/link";
import ProfilePicture from "../profile-picture";
import { currentUserQueryOption } from "@/utils/queryOptions";
import { cn } from "@/lib/utils";

const ProfileLink = ({ className }: { className?: string }) => {
  const { data } = useQuery(currentUserQueryOption);
  return (
    <Link className={cn("relative block w-10 h-10", className)} href="/profile">
      <ProfilePicture
        fill
        sizes="96px"
        ownerName="Your"
        src={data?.profile_picture || "/default.webp"}
      />
    </Link>
  );
};

export default ProfileLink;
