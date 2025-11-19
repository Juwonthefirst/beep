"use client";

import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";

import { getAccessToken } from "@/utils/actions";
import { WebSocketConnectionState } from "@/utils/types/client.type";
import { NotificationSocket } from "@/utils/websocket-handlers";
import NotificationCard from "./notification-card";

const notificationSocket = new NotificationSocket({ getAccessToken });

const Notifications = () => {
  const [connectionState, setConnectionState] =
    useState<WebSocketConnectionState>("connecting");

  useEffect(() => {
    notificationSocket.onConnectionStateChange = (connectionState) =>
      setConnectionState(connectionState);

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

    notificationSocket.connect();
    notificationSocket.listenForNotifications();

    return () => {
      notificationSocket.stopListeningForNotifications();
      notificationSocket.disconnect();
    };
  }, []);

  return <Toaster position="top-center" className="mx-auto" />;
};

export default Notifications;
