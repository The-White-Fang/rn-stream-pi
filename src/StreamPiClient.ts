import { EventEmitter } from 'events';
import { StorageManager } from './storage/StorageManager';
import { ActionSchema, ConfigSchema, StoredAction, StoredConfig, isActionSchema, isConfigSchema } from './types/schema';

export class StreamPiClient extends EventEmitter {
  private config: ConfigSchema;
  private storage: StorageManager;
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;

  constructor(config: ConfigSchema) {
    super();
    if (!isConfigSchema(config)) {
      throw new Error('Invalid config schema');
    }
    this.config = config;
    this.storage = new StorageManager(config);
  }

  async initialize(): Promise<void> {
    try {
      // Load stored config if exists
      const storedConfig = await this.storage.getConfig();
      if (storedConfig) {
        this.config = { ...this.config, ...storedConfig };
      }

      // Connect to WebSocket server
      await this.connect();

      // Store current config
      await this.storage.storeConfig(this.config);
    } catch (error) {
      console.error('Failed to initialize StreamPiClient:', error);
      throw error;
    }
  }

  private async connect(): Promise<void> {
    if (this.ws) {
      this.ws.close();
    }

    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.config.serverUrl);

        this.ws.onopen = () => {
          this.reconnectAttempts = 0;
          this.emit('connected');
          resolve();
        };

        this.ws.onclose = () => {
          this.emit('disconnected');
          this.handleReconnect();
        };

        this.ws.onerror = (error) => {
          this.emit('error', error);
          if (this.reconnectAttempts === 0) {
            reject(error);
          }
        };

        this.ws.onmessage = (event) => {
          this.handleMessage(event.data);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.emit('error', new Error('Max reconnection attempts reached'));
      return;
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    this.reconnectTimeout = setTimeout(() => {
      this.reconnectAttempts++;
      this.connect().catch((error) => {
        this.emit('error', error);
      });
    }, Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000));
  }

  private async handleMessage(data: string): Promise<void> {
    try {
      const message = JSON.parse(data);
      
      if (message.type === 'action' && isActionSchema(message.data)) {
        await this.storage.storeAction(message.data);
        this.emit('action', message.data);
      } else if (message.type === 'config' && isConfigSchema(message.data)) {
        await this.storage.storeConfig(message.data);
        this.emit('config', message.data);
      }
    } catch (error) {
      console.error('Failed to handle message:', error);
      this.emit('error', error);
    }
  }

  async sendMessage(message: any): Promise<void> {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket is not connected');
    }
    this.ws.send(JSON.stringify(message));
  }

  async getStoredAction(actionId: string): Promise<StoredAction | null> {
    return this.storage.getAction(actionId);
  }

  async getStoredConfig(): Promise<StoredConfig | null> {
    return this.storage.getConfig();
  }

  async listStoredActions(): Promise<string[]> {
    return this.storage.listStoredActions();
  }

  disconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
} 
} 