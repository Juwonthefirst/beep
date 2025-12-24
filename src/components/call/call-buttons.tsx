"use client";

import { use } from "react";
import { Phone, Video } from "lucide-react";
import { CurrentRoomNameContext } from "../providers/chatroom-state.provider";
import { CallControlsContext } from "../providers/call-provider";
import { CallerInfo } from "@/utils/types/client.type";

const CallButtons = ({
  iconSize,
  callerInfo,
  className,
}: {
  iconSize: number;
  callerInfo: CallerInfo;
  className?: string;
}) => {
  const callControls = use(CallControlsContext);
  const roomName = use(CurrentRoomNameContext);

  return (
    <>
      <button
        className={className}
        disabled={callControls?.isInCall}
        onClick={() =>
          callControls?.setCurrentCallState({
            roomName,
            callerInfo,
            callType: "voice",
            startedCall: true,
            callId: null,
          })
        }
      >
        <Phone size={iconSize} />
      </button>
      <button
        className={className}
        disabled={callControls?.isInCall}
        onClick={() =>
          callControls?.setCurrentCallState({
            roomName,
            callerInfo,
            callType: "video",
            startedCall: true,
            callId: null,
          })
        }
      >
        <Video size={iconSize} />
      </button>
    </>
  );
};

export default CallButtons;
