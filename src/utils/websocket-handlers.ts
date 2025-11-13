import type { UUID } from "crypto";
import type {
  WebSocketConnectionState,
  WebsocketMessage,
} from "./types/client.type";
import {
  ChatSocketMessage,
  ChatSocketTyping,
} from "./types/server-response.type";
import { withRetry } from "./helpers";

type GetAccessToken = () => Promise<string | undefined>;

interface SocketConstructor {
  url: string;
  getAccessToken: GetAccessToken;
}

class Socket {
  protected socket: WebSocket | null;
  private readonly url: string;
  private readonly maxRetry: number;
  private retryTimeout: number;
  private retryCount: number;
  protected socketConnected: boolean;
  private getAccessToken: GetAccessToken;
  onConnectionStateChange?:
    | ((connectionState: WebSocketConnectionState) => void)
    | null;

  constructor({ url, getAccessToken }: SocketConstructor) {
    this.socket = null;
    this.url = url;
    this.maxRetry = 5;
    this.retryTimeout = 1000;
    this.retryCount = 0;
    this.socketConnected = false;
    this.getAccessToken = getAccessToken;
    this.onConnectionStateChange = null;
  }

  async connect() {
    try {
      await withRetry<void>({
        func: async () => {
          const accessToken = await this.getAccessToken();
          await new Promise<void>((resolve, reject) => {
            this.socket = new WebSocket(this.url + `?token=${accessToken}`);
            this.socket.onopen = () => {
              this.retryCount = 0;
              this.socketConnected = true;
              this.onConnectionStateChange?.("connected");
              resolve();
            };
            this.handleClose(reject);
            this.handleError(reject);
          });
        },
      });
    } catch (error) {}

    const accessToken = await this.getAccessToken();
    this.socket = new WebSocket(this.url + `?token=${accessToken}`);
    this.socket.onopen = () => {
      this.retryCount = 0;
      this.socketConnected = true;
      this.onConnectionStateChange?.("connected");
    };
    this.handleClose();
    this.handleError();
  }

  disconnect() {
    if (!this.socket) return;
    this.onConnectionStateChange?.("disconnected");
    this.socket.close(1000);
  }

  private handleClose(reject?: () => void) {
    if (!this.socket) return;
    this.socket.onclose = (event) => {
      if (
        !(event.code === 1000 || event.code === 1001) &&
        this.retryCount < this.maxRetry
      ) {
        this.retryCount++;
        this.retryTimeout *= 1.5;
        setTimeout(() => this.connect(), Math.min(this.retryTimeout, 10000));
      }
      this.socketConnected = false;
      this.socket = null;
    };
  }

  private handleError() {
    if (!this.socket) return;
    this.socket.onerror = () => {
      this.socketConnected = false;
    };
  }
}

export class ChatSocket extends Socket {
  private currentRoom: string | null;
  private readonly pendingMessages: WebsocketMessage[];
  private onTyping: (() => void) | null;
  private onMessage: ((message: ChatSocketMessage) => void) | null;

  constructor({ url, getAccessToken }: SocketConstructor) {
    super({ url, getAccessToken });
    this.currentRoom = null;
    this.pendingMessages = [];
    this.onTyping = null;
    this.onMessage = null;
  }

  private send(data: WebsocketMessage) {
    if (!this.socketConnected) {
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
    onTyping: () => void
  ) {
    const status = this.send({ action: "group_join", room_name: groupName });
    this.currentRoom = groupName;
    this.onMessage = onMessage;
    this.onTyping = onTyping;
    this.listenForMessages();
    return status;
  }

  leaveGroup() {
    const status = this.send({ action: "group_leave" });
    this.currentRoom = null;
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
      if ("typing" in data && data.room_name === this.currentRoom)
        return this.onTyping?.();
    };
  }
}

interface NotificationSocketConstructor extends SocketConstructor {
  onNotification: () => void;
}

export class NotificationSocket extends Socket {
  constructor({ url, getAccessToken }: NotificationSocketConstructor) {
    super({ url, getAccessToken });
  }
}
