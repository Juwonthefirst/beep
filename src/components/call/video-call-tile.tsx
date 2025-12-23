import { ParticipantMetaData } from "@/utils/types/server-response.type";
import { useParticipantTracks, VideoTrack } from "@livekit/components-react";
import { Track } from "livekit-client";
import ParticipantInfoCard from "./participant-info-card";

type Props = { participantData: ParticipantMetaData };

const VideoCallTile = ({ participantData }: Props) => {
  const [videoTrackRef] = useParticipantTracks([Track.Source.Camera]);

  return (
    <div className="relative flex justify-center w-full h-full group-data-[isminimized=true]:rounded-lg overflow-hidden">
      <ParticipantInfoCard
        className="absolute top-4"
        participantData={participantData}
      />
      {videoTrackRef && (
        <VideoTrack
          className="w-full h-full object-cover"
          trackRef={videoTrackRef}
        />
      )}
    </div>
  );
};

export default VideoCallTile;
