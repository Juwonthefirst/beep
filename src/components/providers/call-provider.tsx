"use client";

import {
  useState,
  createContext,
  type Dispatch,
  type SetStateAction,
  type ReactNode,
  useMemo,
} from "react";

import { CallState } from "@/utils/types/client.type";
import CallView from "../call/call-view";

type CallControlsContextType = {
  setCurrentCallState: Dispatch<SetStateAction<CallState | null>>;
  currentRoom: string;
  isInCall: boolean;
};

export const CallControlsContext =
  createContext<CallControlsContextType | null>(null);

const CallProvider = ({ children }: { children: ReactNode }) => {
  const [currentCallState, setCurrentCallState] = useState<CallState | null>(
    null
  );

  const [isInCall, setIsInCall] = useState(false);

  const currentRoom = currentCallState?.roomName || "";

  const callControls: CallControlsContextType = useMemo(
    () => ({ setCurrentCallState, currentRoom, isInCall }),
    [currentRoom, isInCall]
  );

  return (
    <>
      <CallView
        setIsInCall={setIsInCall}
        callState={currentCallState}
        setCallState={setCurrentCallState}
      />

      <CallControlsContext value={callControls}>{children}</CallControlsContext>
    </>
  );
};

export default CallProvider;
