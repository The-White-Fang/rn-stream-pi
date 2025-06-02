import { NativeModules, NativeEventEmitter } from 'react-native';
import { EventEmitter } from 'events';

const { StreamPi } = NativeModules;

export interface StreamPiConfig {
  serverHost: string;
  serverPort: number;
  clientName: string;
  version: string;
}

export interface DisplayMetrics {
  width: number;
  height: number;
  density: number;
  scaledDensity: number;
  xdpi: number;
  ydpi: number;
}

export interface DeviceInfo {
  platform: string;
  model: string;
  manufacturer: string;
  version: string;
  sdkVersion: string;
}

export interface WebSocketMessage {
  type: string;
  data: unknown;
}

export class StreamPiClient extends EventEmitter {
  private ws: WebSocket | null = null;
  private config: StreamPiConfig;
  private deviceInfo: DeviceInfo | null = null;
  private displayMetrics: DisplayMetrics | null = null;

  constructor(config: StreamPiConfig) {
    super();
    this.config = config;
  }

  async initialize(): Promise<void> {
    try {
      // Get device information
      this.deviceInfo = await StreamPi.getDeviceInfo();
      this.displayMetrics = await StreamPi.getDisplayMetrics();
      
      // Initialize WebSocket connection
      await this.connect();
    } catch (error) {
      console.error('Failed to initialize StreamPiClient:', error);
      throw error;
    }
  }

  private async connect(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        this.ws = new WebSocket(`ws://${this.config.serverHost}:${this.config.serverPort}`);

        this.ws.onopen = () => {
          this.emit('connected');
          this.sendHandshake();
          resolve();
        };

        this.ws.onmessage = (event: MessageEvent) => {
          this.handleMessage(event.data);
        };

        this.ws.onerror = (error: Event) => {
          this.emit('error', error);
          reject(error);
        };

        this.ws.onclose = () => {
          this.emit('disconnected');
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  private sendHandshake(): void {
    const handshake: WebSocketMessage = {
      type: 'handshake',
      data: {
        clientName: this.config.clientName,
        version: this.config.version,
        deviceInfo: this.deviceInfo,
        displayMetrics: this.displayMetrics
      }
    };
    this.sendMessage(handshake);
  }

  private handleMessage(data: string): void {
    try {
      const message: WebSocketMessage = JSON.parse(data);
      this.emit('message', message);

      switch (message.type) {
        case 'action':
          this.emit('action', message.data);
          break;
        case 'profile':
          this.emit('profile', message.data);
          break;
        case 'config':
          this.emit('config', message.data);
          break;
        default:
          console.warn('Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('Failed to handle message:', error);
      this.emit('error', error);
    }
  }

  public sendMessage(message: WebSocketMessage): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      throw new Error('WebSocket is not connected');
    }
  }

  public disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  public async getStoragePath(): Promise<string> {
    return await StreamPi.getStoragePath();
  }
} 