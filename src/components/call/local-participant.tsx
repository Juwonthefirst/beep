"use client";

import {
  useParticipantContext,
  useParticipantTracks,
  VideoTrack,
} from "@livekit/components-react";
import { Track } from "livekit-client";

const LocalParticipant = () => {
  const participant = useParticipantContext();
  const videoTrackRef = useParticipantTracks([Track.Source.Camera]);

  return (
    <>
      {participant && participant.isCameraEnabled && participant.isLocal && (
        <div className="group-data-[isminimized=true]:hidden w-24 md:w-30 h-1/4 absolute bottom-28 right-4 z-10 overflow-hidden">
          <VideoTrack
            className="w-full h-full rounded-md object-cover"
            trackRef={videoTrackRef[0]}
          />
        </div>
      )}
    </>
  );
};

export default LocalParticipant;
