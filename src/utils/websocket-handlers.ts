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
  private socketConnected: boolean;
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

export class ChatSocket extends Socket {
  currentRoom: string | null;
  constructor({ url, getAccessToken, onConnected }: SocketConstructor) {
    super({ url, getAccessToken, onConnected });
    this.currentRoom = null;
  }

  send(data: object) {
    if (!this.socket) return;
    this.socket.send(JSON.stringify(data));
  }

  addToGroup(groupName: string) {
    if (!this.socket) return;
    this.socket.send;
  }
}
