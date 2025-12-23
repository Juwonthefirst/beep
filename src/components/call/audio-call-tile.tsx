"use client";

import ProfilePicture from "../profile-picture";

import { ParticipantMetaData } from "@/utils/types/server-response.type";
import ParticipantInfoCard from "./participant-info-card";
import { useIsSpeaking } from "@livekit/components-react";
import { cn } from "@/lib/utils";

type Props = { participantData: ParticipantMetaData };

const AudioCallTile = ({ participantData }: Props) => {
  const isSpeaking = useIsSpeaking();
  return (
    <div className="flex flex-col gap-4 group-data-[isminimized=true]:gap-2 items-center mt-6">
      <div className="relative size-36 group-data-[isminimized=true]:size-16  rounded-full mb-2">
        <span
          className={cn(
            "absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-50",
            { hidden: !isSpeaking }
          )}
        ></span>

        <ProfilePicture
          ownerName={participantData.username}
          src={participantData.profile_picture}
          fill
          sizes="288px"
        />
      </div>
      <ParticipantInfoCard participantData={participantData} />
    </div>
  );
};

export default AudioCallTile;
