import type { UUID } from "crypto";
import { Attachment, Message } from "./server-response.type";

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
      attachment?: Attachment;
    };

export type WebSocketConnectionSuccessState = "connected" | "reconnected";

export type WebSocketConnectionLoadingState = "reconnecting" | "connecting";
export type WebSocketConnectionFailedState =
  | "reconnection_failed"
  | "disconnected";

export type WebSocketConnectionState =
  | WebSocketConnectionSuccessState
  | WebSocketConnectionLoadingState
  | WebSocketConnectionFailedState;

export const isWebSocketLoadingState = (
  value: string
): value is WebSocketConnectionLoadingState => {
  return value === "reconnecting" || value === "connecting";
};

export const isWebSocketSuccessState = (
  value: string
): value is WebSocketConnectionSuccessState => {
  return value === "reconnected" || value === "connected";
};

export const isWebSocketFailedState = (
  value: string
): value is WebSocketConnectionSuccessState => {
  return value === "disconnected" || value === "reconnection_failed";
};

export type ChatSocketSend = (
  message: string,
  attachment?: Attachment,
  uuid?: UUID
) => void;

export type ChatSocketTyping = () => void;

export interface MessageGroup {
  userId: number;
  type: "message";
  hasDateHeader: boolean;
  messages: Message[];
}
