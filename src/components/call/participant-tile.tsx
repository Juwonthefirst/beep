"use client";

import { useParticipantContext } from "@livekit/components-react";
import { ParticipantMetaData } from "@/utils/types/server-response.type";
import VideoCallTile from "./video-call-tile";
import AudioCallTile from "./audio-call-tile";

const ParticipantTile = () => {
  const participant = useParticipantContext();

  const participantMetaData = participant.metadata;
  if (!participantMetaData) return;
  const participantData: ParticipantMetaData = JSON.parse(participantMetaData);

  return participant.isCameraEnabled ? (
    <VideoCallTile participantData={participantData} />
  ) : (
    <AudioCallTile participantData={participantData} />
  );
};

export default ParticipantTile;
