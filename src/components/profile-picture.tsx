"use client";

import { cn } from "@/lib/utils";
import Image, { type ImageProps } from "next/image";
import { useState } from "react";

type Props = {
  ownerName: string;
  className?: string;
  isServerMedia?: boolean;
} & Omit<ImageProps, "alt" | "blurDataURL">;

const ProfilePicture = ({ ownerName, className, ...imageProps }: Props) => {
  const [loadFailed, setloadFailed] = useState(false);

  return (
    <Image
      className={cn("rounded-full object-cover shadow-md", className)}
      alt={`${ownerName} profile picture`}
      placeholder="blur"
      blurDataURL="/default.webp"
      {...imageProps}
      onError={() => setloadFailed(true)}
      src={loadFailed ? "/default.webp" : imageProps.src}
    />
  );
};

export default ProfilePicture;
