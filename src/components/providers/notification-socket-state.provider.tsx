import { WebSocketConnectionState } from "@/utils/types/client.type";
import { createContext, type ReactNode } from "react";

interface Props {
  connectionState: WebSocketConnectionState;
  children: ReactNode;
}

export const NotificationSocketStateContext =
  createContext<WebSocketConnectionState>("disconnected");

const NotificationSocketStateProvider = ({
  connectionState,
  children,
}: Props) => {
  return (
    <NotificationSocketStateContext value={connectionState}>
      {children}
    </NotificationSocketStateContext>
  );
};

export default NotificationSocketStateProvider;
