import type { UUID } from "crypto";
import {
  isWebSocketLoadingState,
  isWebSocketSuccessState,
  type WebSocketConnectionFailedState,
  type WebSocketConnectionLoadingState,
  type WebSocketConnectionState,
  type WebSocketConnectionSuccessState,
  type WebsocketMessage,
} from "./types/client.type";
import type {
  CallNotification,
  ChatNotification,
  ChatSocketMessage,
  ChatSocketTyping,
  FriendEventNotification,
  GroupEventNotification,
  NotificationMessage,
  OnlineStatusNotification,
} from "./types/server-response.type";
import { withRetry } from "./helpers/client-helper";

type GetAccessToken = () => Promise<string | undefined>;

interface SocketConstructor {
  url: string;
  getAccessToken: GetAccessToken;
}

class Socket {
  protected socket: WebSocket | null;
  private readonly url: string;
  private readonly maxRetry: number;
  private getAccessToken: GetAccessToken;
  protected connectionState: WebSocketConnectionState;
  onConnectionStateChange?:
    | ((connectionState: WebSocketConnectionState) => void)
    | null;

  private readonly updateConnectionState: (
    connectionState: WebSocketConnectionState
  ) => void;

  constructor({ url, getAccessToken }: SocketConstructor) {
    this.socket = null;
    this.url = url;
    this.maxRetry = 5;
    this.connectionState = "disconnected";
    this.getAccessToken = getAccessToken;
    this.onConnectionStateChange = null;
    this.updateConnectionState = (
      connectionState: WebSocketConnectionState
    ) => {
      this.connectionState = connectionState;
      this.onConnectionStateChange?.(connectionState);
    };
  }

  private async createWebsocketConnection(
    successState: WebSocketConnectionSuccessState,
    loadingState: WebSocketConnectionLoadingState,
    failedState: WebSocketConnectionFailedState
  ) {
    if (this.connectionState === loadingState) return;
    this.updateConnectionState(loadingState);
    try {
      await withRetry<void>({
        func: async () => {
          const accessToken = await this.getAccessToken();
          await new Promise<void>((resolve, reject) => {
            this.socket = new WebSocket(
              this.url + `?token=${accessToken || ""}`
            );
            this.socket.onopen = () => {
              this.updateConnectionState(successState);
              resolve();
            };
            this.handleClose(resolve, reject);
            this.handleError(reject);
          });
        },
        maxRetryCount: this.maxRetry,
      });
    } catch (e) {
      void e;
      this.socket = null;
      this.updateConnectionState(failedState);
    }
  }

  async connect() {
    await this.createWebsocketConnection(
      "connected",
      "connecting",
      "disconnected"
    );
  }

  async reconnect() {
    await this.createWebsocketConnection(
      "reconnected",
      "reconnecting",
      "reconnection_failed"
    );
  }

  disconnect() {
    if (!this.socket) return;
    this.updateConnectionState("disconnected");
    this.socket.close(1000);
  }

  private handleClose(resolve: () => void, reject: () => void) {
    if (!this.socket) return;
    this.socket.onclose = (event) => {
      if (isWebSocketLoadingState(this.connectionState)) {
        if (event.code === 1000 || event.code === 1001) return resolve();
        return reject();
      }
      if (isWebSocketSuccessState(this.connectionState)) {
        this.reconnect();
        return;
      }
    };
  }

  private handleError(reject: () => void) {
    if (!this.socket) return;
    this.socket.onerror = (message) => {
      console.error(message);
      reject();
    };
  }
}

export class ChatSocket extends Socket {
  private currentRoom: string | null;
  private readonly pendingMessages: WebsocketMessage[];
  private onTyping: ((sender_username: string) => void) | null;
  private onMessage: ((message: ChatSocketMessage) => void) | null;
  onRoomChange: ((roomName: string | null) => void) | null;
  private readonly updateCurrentRoom: (roomName: string | null) => void;

  constructor({ getAccessToken }: Omit<SocketConstructor, "url">) {
    const url = process.env.NEXT_PUBLIC_WEBSOCKET_URL + "/chat/";
    super({ url, getAccessToken });
    this.currentRoom = null;
    this.pendingMessages = [];
    this.onTyping = null;
    this.onMessage = null;
    this.onRoomChange = null;
    this.updateCurrentRoom = (newRoomName) => {
      this.currentRoom = newRoomName;
      this.onRoomChange?.(newRoomName);
    };
  }

  private send(data: WebsocketMessage) {
    if (!isWebSocketSuccessState(this.connectionState)) {
      this.pendingMessages.push(data);
      return "pending";
    }
    if (!this.socket) return;
    this.socket.send(JSON.stringify(data));
    return "sent";
  }

  joinGroup(
    groupName: string,
    onMessage: (message: ChatSocketMessage) => void,
    onTyping: (sender_username: string) => void
  ) {
    const status = this.send({ action: "group_join", room_name: groupName });
    this.updateCurrentRoom(groupName);
    this.onMessage = onMessage;
    this.onTyping = onTyping;
    this.listenForMessages();
    return status;
  }

  leaveGroup() {
    const status = this.send({ action: "group_leave" });
    this.updateCurrentRoom(null);
    this.onMessage = null;
    this.onTyping = null;
    return status;
  }

  typing() {
    return this.send({ action: "typing" });
  }

  chat(message: string, attachment?: { id: number; url: string }) {
    const uuid = crypto.randomUUID() as UUID;
    this.send({ action: "chat", message, uuid, attachment });
    return uuid;
  }

  private listenForMessages() {
    if (!this.socket) return;
    this.socket.onmessage = (event) => {
      const data: ChatSocketTyping | ChatSocketMessage = JSON.parse(event.data);
      if (data.room_name !== this.currentRoom) return;
      if ("typing" in data) return this.onTyping?.(data.sender_username);
      return this.onMessage?.(data);
    };
  }
}

export class NotificationSocket extends Socket {
  onChatNotification: ((message: ChatNotification) => void) | null;
  onCallNotification: ((message: CallNotification) => void) | null;
  onFriendNotification: ((message: FriendEventNotification) => void) | null;
  onGroupNotification: ((message: GroupEventNotification) => void) | null;
  onOnlineStatusNotification:
    | ((message: OnlineStatusNotification) => void)
    | null;

  constructor({ getAccessToken }: Omit<SocketConstructor, "url">) {
    const url = process.env.NEXT_PUBLIC_WEBSOCKET_URL + "/notification/";
    super({ url, getAccessToken });
    this.onChatNotification = null;
    this.onCallNotification = null;
    this.onFriendNotification = null;
    this.onGroupNotification = null;
    this.onOnlineStatusNotification = null;
  }

  listenForNotifications() {
    if (!this.socket) return;
    this.socket.onmessage = (event) => {
      const data: NotificationMessage = JSON.parse(event.data);
      switch (data.type) {
        case "chat_notification":
          return this.onChatNotification?.(data);
        case "online_status_notification":
          return this.onOnlineStatusNotification?.(data);
        case "friend_notification":
          return this.onFriendNotification?.(data);
        case "group_notification":
          return this.onGroupNotification?.(data);
        case "call_notification":
          return this.onCallNotification?.(data);
      }
    };
  }

  stopListeningForNotifications() {
    if (!this.socket) return;
    this.socket.onmessage = null;
  }
}
