import type { UUID } from "crypto";

export type ApiMethods = "get" | "post" | "patch" | "put" | "delete";

export interface SignupStepsProps {
  email: string;
  onSuccess: (formValue?: string) => void;
}

export interface ValidationRequirement {
  message: string;
  test: (value: string) => boolean;
}

export type ValidationState = "valid" | "loading" | "invalid" | "idle";

export type WebsocketMessage =
  | { action: "group_join"; room_name: string }
  | { action: "group_leave" }
  | { action: "typing" }
  | {
      action: "chat";
      message: string;
      uuid: UUID;
      attachment?: { id: number; url: string };
    };

export type WebSocketConnectionState =
  | "connected"
  | "connecting"
  | "reconnecting"
  | "reconnected"
  | "reconnection_failed"
  | "disconnected";
