"use client";
import type { CallState } from "@/utils/types/client.type";
import { TrackToggle } from "@livekit/components-react";
import { Track } from "livekit-client";
import {
  Mic,
  MicOff,
  Phone,
  SwitchCamera,
  Video,
  VideoOff,
} from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";

interface Props {
  setCallState: Dispatch<SetStateAction<CallState | null>>;
}

const ControlBar = ({ setCallState }: Props) => {
  const iconStyling = "group-data-[isminimized=true]:size-5 size-6 ";
  const buttonStyling =
    "p-2 w-fit h-fit hover:bg-white/20 rounded-full shrink-0";

  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);

  return (
    <div
      className={
        "absolute bottom-10 group-data-[isminimized=true]:bottom-6 transition-all duration-300 bg-black/20 backdrop-blur-lg backdrop-saturate-200  flex gap-3 items-center border border-white/20 rounded-full px-1 py-0.5"
      }
    >
      <button className={buttonStyling} type="button">
        <SwitchCamera className={iconStyling} />
      </button>
      <TrackToggle
        showIcon={false}
        onChange={(enabled) => {
          setIsVideoEnabled(enabled);
        }}
        source={Track.Source.Camera}
        className={buttonStyling}
        type="button"
      >
        {isVideoEnabled ? (
          <VideoOff className={iconStyling} />
        ) : (
          <Video className={iconStyling} />
        )}
      </TrackToggle>
      <button
        onClick={() => setCallState(null)}
        className=" bg-red-500/30 text-red-500 p-3 group-data-[isminimized=true]:p-2 rounded-full rotate-135 transition-all duration-300 "
        type="button"
      >
        <Phone className="group-data-[isminimized=true]:size-6 size-8 transition-all duration-300" />
      </button>
      <TrackToggle
        onChange={(enabled) => {
          setIsAudioEnabled(enabled);
        }}
        showIcon={false}
        source={Track.Source.Microphone}
        className={buttonStyling}
        type="button"
      >
        {isAudioEnabled ? (
          <MicOff className={iconStyling} />
        ) : (
          <Mic className={iconStyling} />
        )}
      </TrackToggle>
    </div>
  );
};

export default ControlBar;
