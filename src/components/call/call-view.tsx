"use client";

import { Room, VideoPresets } from "livekit-client";
import { Maximize2, Minimize2 } from "lucide-react";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import {
  ParticipantContext,
  RoomAudioRenderer,
  RoomContext,
} from "@livekit/components-react";
import type { CallState } from "@/utils/types/client.type";
import type { RoomMetadata } from "@/utils/types/server-response.type";
import { cn } from "@/lib/utils";
import { withRetry } from "@/utils/helpers/client-helper";
import { fetchCallAccessToken } from "@/utils/actions";
import ControlBar from "./control-bar";
import LocalParticipant from "./local-participant";
import OneToOneCall from "./one-to-one-call";
import CallerInfoProvider from "../providers/caller-info.provider";

interface Props {
  callState: CallState | null;
  setCallState: Dispatch<SetStateAction<CallState | null>>;
  setIsInCall: Dispatch<SetStateAction<boolean>>;
}

const CallView = ({ callState, setCallState, setIsInCall }: Props) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [room] = useState(
    () =>
      new Room({
        adaptiveStream: true,
        dynacast: true,
        videoCaptureDefaults: {
          resolution: VideoPresets.h360.resolution,
        },
      })
  );
  const [globalState, setglobalState] = useState<
    "success" | "error" | "loading" | "idle"
  >("idle");

  useEffect(() => {
    if (!callState) return;

    (async () => {
      const data = await withRetry({
        func: () => fetchCallAccessToken(callState),
      });
      if (data.status === "success") {
        await room.connect(data.data.room_url, data.data.token);
        await room.localParticipant.setMicrophoneEnabled(true);
        setIsInCall(true);

        room.on("disconnected", () => {
          setCallState(null);
        });

        const roomMetaData: RoomMetadata | null = room.metadata
          ? JSON.parse(room.metadata)
          : null;
        const roomIsVideoCall = roomMetaData
          ? roomMetaData.is_video_call
          : callState.callType;

        if (roomIsVideoCall) {
          room.localParticipant.setCameraEnabled(true);
        }
      }
    })();

    return () => {
      setIsInCall(false);
      room.disconnect();
    };
  }, [callState, room, setCallState, setIsInCall]);

  return (
    callState && (
      <div
        data-isminimized={isMinimized}
        className={cn(
          "group fixed top-0 right-0 z-50 w-full h-full bg-black transition-all duration-300 text-white flex flex-col items-center",
          {
            "w-54 h-54 md:w-68 md:scale-30 rounded-lg top-4 right-4":
              isMinimized,
          }
        )}
      >
        <button
          className="absolute z-50 top-2 right-2 text-white hover:bg-white/20 p-2 rounded-full"
          onClick={() => setIsMinimized(!isMinimized)}
        >
          {isMinimized ? <Maximize2 /> : <Minimize2 />}
        </button>
        <RoomContext value={room}>
          <CallerInfoProvider value={callState.callerInfo}>
            <div className=" w-full h-full">{<OneToOneCall />}</div>
          </CallerInfoProvider>

          <ParticipantContext value={room.localParticipant}>
            <LocalParticipant />
          </ParticipantContext>

          <ControlBar setCallState={setCallState} />
          <RoomAudioRenderer />
        </RoomContext>
      </div>
    )
  );
};

export default CallView;
