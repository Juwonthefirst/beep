import type { UUID } from "crypto";
import type { WebsocketMessage } from "./types/client.type";
import {
  ChatSocketMessage,
  ChatSocketTyping,
} from "./types/server-response.type";

type GetAccessToken = () => Promise<string>;

interface SocketConstructor {
  url: string;
  getAccessToken: GetAccessToken;
  onConnected: () => void;
}

class Socket {
  protected socket: WebSocket | null;
  private readonly url: string;
  private readonly maxRetry: number;
  private retryTimeout: number;
  private retryCount: number;
  protected socketConnected: boolean;
  private getAccessToken: GetAccessToken;
  private onConnected: () => void;

  constructor({ url, getAccessToken, onConnected }: SocketConstructor) {
    this.socket = null;
    this.url = url;
    this.maxRetry = 5;
    this.retryTimeout = 1000;
    this.retryCount = 0;
    this.socketConnected = false;
    this.getAccessToken = getAccessToken;
    this.onConnected = onConnected;
  }

  async connect() {
    const accessToken = await this.getAccessToken();
    this.socket = new WebSocket(this.url + `?token=${accessToken}`);
    this.socket.onopen = () => {
      this.retryCount = 0;
      this.socketConnected = true;
      this.onConnected();
    };
    this.handleClose();
    this.handleError();
  }

  disconnect() {
    if (!this.socket) return;
    this.socket.close(1000);
    this.socket = null;
  }

  private handleClose() {
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
    };
  }

  private handleError() {
    if (!this.socket) return;
    this.socket.onerror = () => {
      this.socketConnected = false;
    };
  }
}

interface ChatSocketConstructor extends SocketConstructor {
  onTyping: () => void;
  onMessage: (message: ChatSocketMessage) => void;
}

export class ChatSocket extends Socket {
  currentRoom: string | null;
  private readonly pendingMessages: WebsocketMessage[];
  private readonly onTyping: () => void;
  private readonly onMessage: (message: ChatSocketMessage) => void;
  constructor({
    url,
    getAccessToken,
    onConnected: onSocketConnect,
    onTyping,
    onMessage,
  }: ChatSocketConstructor) {
    const onConnected = () => {
      for (const message of this.pendingMessages) {
        this.send(message);
      }
      onSocketConnect();
    };
    super({ url, getAccessToken, onConnected });
    this.currentRoom = null;
    this.pendingMessages = [];
    this.onTyping = onTyping;
    this.onMessage = onMessage;
  }

  send(data: WebsocketMessage) {
    if (!this.socketConnected) {
      this.pendingMessages.push(data);
      return "pending";
    }
    if (!this.socket) return;
    this.socket.send(JSON.stringify(data));
    return "sent";
  }

  joinGroup(groupName: string) {
    const status = this.send({ action: "group_join", room_name: groupName });
    this.currentRoom = groupName;
    this.listenForMessages();
    return status;
  }

  leaveGroup() {
    const status = this.send({ action: "group_leave" });
    this.currentRoom = null;
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
        return this.onTyping();
    };
  }
}

interface NotificationSocketConstructor extends SocketConstructor {
  onNotification: () => void;
}

export class NotificationSocket extends Socket {
  constructor({
    url,
    getAccessToken,
    onConnected,
  }: NotificationSocketConstructor) {
    super({ url, getAccessToken, onConnected });
  }
}
