"use client";

import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";

import { getAccessToken } from "@/utils/actions";
import { WebSocketConnectionState } from "@/utils/types/client.type";
import { NotificationSocket } from "@/utils/websocket-handlers";
import NotificationCard from "./notification-card";
import NotificationSocketStateProvider from "../providers/notification-socket-state.provider";
import { useQueryClient } from "@tanstack/react-query";
import { chatQueryOption } from "@/utils/queryOptions";
import {
  UserChatRoom,
  GroupChatRoom,
} from "@/utils/types/server-response.type";

const notificationSocket = new NotificationSocket({ getAccessToken });

const Notifications = ({ children }: { children: React.ReactNode }) => {
  const [connectionState, setConnectionState] =
    useState<WebSocketConnectionState>("connecting");
  const queryClient = useQueryClient();

  useEffect(() => {
    notificationSocket.onConnectionStateChange = (connectionState) => {
      setConnectionState(connectionState);
    };

    notificationSocket.onChatNotification = (message) => {
      toast.custom((toastId) => (
        <NotificationCard
          profilePictureURL={message.sender_profile_picture}
          toastId={toastId}
          header={message.sender}
          description={message.message}
          notificationURL={`/chat/${message.room_name}`}
          timestamp={message.timestamp}
        />
      ));
    };

    notificationSocket.onFriendNotification = (message) => {
      toast.custom((toastId) => (
        <NotificationCard
          toastId={toastId}
          profilePictureURL={message.sender_profile_picture}
          header={message.sender}
          description={
            message.sender + " " + message.action === "accepted"
              ? "accepted your friend request"
              : "sent you a friend request"
          }
          notificationURL={`/friends/requests/`}
        />
      ));
    };

    notificationSocket.onOnlineStatusNotification = (message) => {
      queryClient.setQueryData<UserChatRoom | GroupChatRoom>(
        chatQueryOption(message.room_name).queryKey,
        (old) => {
          if (!old || old.is_group) return old;
          const newData = structuredClone(old);
          newData.friend.is_online = message.status;
          newData.friend.last_online = message.last_online;
          return newData;
        }
      );
    };

    (async () => {
      await notificationSocket.connect();
      notificationSocket.listenForNotifications();
    })();

    return () => {
      notificationSocket.stopListeningForNotifications();
      notificationSocket.disconnect();
    };
  }, [queryClient]);

  return (
    <>
      <Toaster position="top-center" className="mx-auto" />
      <NotificationSocketStateProvider connectionState={connectionState}>
        {children}
      </NotificationSocketStateProvider>
    </>
  );
};

export default Notifications;
