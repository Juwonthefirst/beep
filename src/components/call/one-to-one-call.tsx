import {
  ParticipantContext,
  useRemoteParticipants,
} from "@livekit/components-react";
import ParticipantTile from "./participant-tile";
import Placeholder from "./placeholder";

const OneToOneCall = () => {
  const participants = useRemoteParticipants();

  const participant = participants.at(0);
  if (!participant) return <Placeholder />;
  return (
    <ParticipantContext value={participant}>
      <ParticipantTile />
    </ParticipantContext>
  );
};

export default OneToOneCall;
