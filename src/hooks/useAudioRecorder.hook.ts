import { useCallback, useMemo, useRef, useState } from "react";

export type RecordingState = "paused" | "recording" | "idle";

const useAudioRecorder = () => {
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRecorderRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const closeMicrophone = () =>
    streamRef.current?.getTracks().forEach((track) => track.stop());

  const startRecording = useCallback(async () => {
    if (recordingState === "recording") return;
    setRecordedAudio(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      streamRef.current = stream;

      mediaRecorder.ondataavailable = (event) => {
        audioRecorderRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audio = new Blob(audioRecorderRef.current, {
          type: "audio/webm",
        });
        audioRecorderRef.current = [];
        setRecordedAudio(audio);
      };

      mediaRecorder.start();
      setRecordingState("recording");
    } catch (e) {
      closeMicrophone();
      console.error(e);
      return;
    }
  }, [recordingState]);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    setRecordingState("idle");
    closeMicrophone();
  }, []);
  const pauseRecording = useCallback(() => {
    mediaRecorderRef.current?.pause();
    setRecordingState("paused");
  }, []);
  const resumeRecording = useCallback(() => {
    mediaRecorderRef.current?.resume();
    setRecordingState("recording");
  }, []);
  const clearRecording = useCallback(() => {
    setRecordedAudio(null);
    setRecordingState("idle");
  }, []);

  return useMemo(
    () => ({
      recordingState,
      recordedAudio,
      controls: {
        start: startRecording,
        stop: stopRecording,
        pause: pauseRecording,
        resume: resumeRecording,
        clear: clearRecording,
      },
    }),
    [
      clearRecording,
      pauseRecording,
      recordedAudio,
      recordingState,
      resumeRecording,
      startRecording,
      stopRecording,
    ],
  );
};

export default useAudioRecorder;
