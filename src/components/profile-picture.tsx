"use client";

import { cn } from "@/lib/utils";
import Image, { type ImageProps } from "next/image";
import { useState } from "react";

type Props = {
  ownerName: string;
  className?: string;
  isServerMedia?: boolean;
} & Omit<ImageProps, "alt" | "blurDataURL">;

const ProfilePicture = ({
  ownerName,
  className,
  isServerMedia = true,
  ...imageProps
}: Props) => {
  const [loadFailed, setloadFailed] = useState(false);
  const mediaURL = isServerMedia
    ? process.env.NEXT_PUBLIC_MEDIA_URL! + imageProps.src
    : imageProps.src;

  return (
    <Image
      className={cn("rounded-full object-cover", className)}
      alt={`${ownerName} profile picture`}
      placeholder="blur"
      blurDataURL="/default.webp"
      {...imageProps}
      onError={() => setloadFailed(true)}
      src={loadFailed ? "/default.webp" : mediaURL}
    />
  );
};

export default ProfilePicture;
