import { Mic, Pause, Play, Square, X } from "lucide-react";

interface RecordBtnProps {
  iconSize: number;
  setInputStateToVoice: () => void;
}

export const RecordBtn = ({
  iconSize,
  setInputStateToVoice,
}: RecordBtnProps) => (
  <button
    type="button"
    onClick={() => {
      setInputStateToVoice();
    }}
  >
    <Mic size={iconSize} />
  </button>
);

interface StopBtnProps {
  iconSize: number;
  stopAudioRecording: () => void;
}
export const StopBtn = ({ iconSize, stopAudioRecording }: StopBtnProps) => (
  <button
    type="button"
    onClick={() => {
      stopAudioRecording();
    }}
  >
    <Square size={iconSize} fill="full" className="text-red-500 fill-red-500" />
  </button>
);

interface PlayBtnProps {
  iconSize: number;
  continueAudioRecording: () => void;
}
export const PlayBtn = ({ iconSize, continueAudioRecording }: PlayBtnProps) => (
  <button
    type="button"
    onClick={() => {
      continueAudioRecording();
    }}
  >
    <Play size={iconSize} className="text-theme fill-theme" />
  </button>
);

interface PauseBtnProps {
  iconSize: number;
  pauseAudioRecording: () => void;
}
export const PauseBtn = ({ iconSize, pauseAudioRecording }: PauseBtnProps) => (
  <button
    type="button"
    onClick={() => {
      pauseAudioRecording();
    }}
  >
    <Pause size={iconSize} className="text-red-500" />
  </button>
);

interface CancelBtnProps {
  iconSize: number;
  clearAudioRecording: () => void;
}
export const CancelBtn = ({
  iconSize,
  clearAudioRecording,
}: CancelBtnProps) => (
  <button
    type="button"
    onClick={() => {
      clearAudioRecording();
    }}
  >
    <X size={iconSize} strokeWidth={2.75} className="text-red-500" />
  </button>
);
