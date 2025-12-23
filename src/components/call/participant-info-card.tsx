import { cn } from "@/lib/utils";
import { ParticipantMetaData } from "@/utils/types/server-response.type";
import {
  ConnectionQualityIndicator,
  useConnectionState,
  useParticipantTracks,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { MicOff } from "lucide-react";

type Props = {
  participantData: ParticipantMetaData;
  className?: string;
};

const ParticipantInfoCard = ({ participantData, className }: Props) => {
  const [audioTrackRef] = useParticipantTracks([Track.Source.Microphone]);
  const connectionState = useConnectionState();
  return (
    <div
      className={cn(
        "flex flex-col gap-2 items-center group-data-[isminimized=true]:gap-0.5 ",
        className
      )}
    >
      <div
        className={"flex gap-2 items-center *:transition-all *:duration-200"}
      >
        <p className="group-data-[isminimized=true]:text-sm">
          {participantData.username}
        </p>
        <ConnectionQualityIndicator />
        {audioTrackRef && audioTrackRef.publication.isMuted && (
          <MicOff className="text-red-500" size={18} />
        )}
      </div>
      {connectionState !== "connected" && (
        <p className="text-sm text-yellow-400 group-data-[isminimized=true]:text-xs">
          {connectionState === "disconnected"
            ? "Disconnected"
            : "Connecting..."}
        </p>
      )}
    </div>
  );
};

export default ParticipantInfoCard;
