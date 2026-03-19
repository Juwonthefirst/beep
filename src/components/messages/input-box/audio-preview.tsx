"use client";

import { RecordingState } from "@/hooks/useAudioRecorder.hook";
import { Mic } from "lucide-react";
import { useMemo } from "react";
import { PauseBtn, PlayBtn } from "./audio-controls";

interface Props {
  audioBlob: Blob | null;
  recordingState: RecordingState;
  pauseRecording: () => void;
  continueRecording: () => void;
  iconSize: number;
}

const AudioPreview = ({
  audioBlob,
  recordingState,
  iconSize,
  pauseRecording,
  continueRecording,
}: Props) => {
  const audioBlobURL = useMemo(
    () => (audioBlob ? URL.createObjectURL(audioBlob) : ""),
    [audioBlob],
  );
  return recordingState !== "idle" ? (
    <div className="w-full h-full flex items-center justify-between px-3">
      <span className="w-fit h-fit relative">
        <span
          className="w-full h-full animate-ping bg-red-500 absolute rounded-full transition-all"
          style={{
            animationDuration: "1.2s",
            display: recordingState !== "recording" ? "none" : undefined,
          }}
        ></span>
        <Mic size={iconSize} className=" text-red-500" />
      </span>

      {recordingState === "recording" ? (
        <PauseBtn iconSize={iconSize} pauseAudioRecording={pauseRecording} />
      ) : (
        <PlayBtn
          iconSize={iconSize}
          continueAudioRecording={continueRecording}
        />
      )}
    </div>
  ) : (
    audioBlobURL && (
      <audio
        className="w-full h-full bg-transparent"
        controls
        src={audioBlobURL}
      />
    )
  );
};

export default AudioPreview;
