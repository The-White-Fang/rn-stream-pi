import { NativeModules } from 'react-native';
import { ActionSchema, ConfigSchema, StoredAction, StoredConfig } from '../types/schema';

const { StreamPiModule } = NativeModules;

export class StorageManager {
  private storage: ConfigSchema['storage'];
  private useNativeStorage: boolean;

  constructor(config: ConfigSchema) {
    this.storage = config.storage;
    this.useNativeStorage = !config.storage || config.storage.type === 'native';
  }

  private async nativeGetItem(key: string): Promise<string | null> {
    try {
      return await StreamPiModule.getItem(key);
    } catch (error) {
      console.warn('Native storage get failed:', error);
      return null;
    }
  }

  private async nativeSetItem(key: string, value: string): Promise<void> {
    try {
      await StreamPiModule.setItem(key, value);
    } catch (error) {
      console.warn('Native storage set failed:', error);
      throw error;
    }
  }

  private async nativeRemoveItem(key: string): Promise<void> {
    try {
      await StreamPiModule.removeItem(key);
    } catch (error) {
      console.warn('Native storage remove failed:', error);
      throw error;
    }
  }

  async getItem(key: string): Promise<string | null> {
    if (this.useNativeStorage) {
      return this.nativeGetItem(key);
    }
    return this.storage?.getItem?.(key) ?? null;
  }

  async setItem(key: string, value: string): Promise<void> {
    if (this.useNativeStorage) {
      await this.nativeSetItem(key, value);
    } else {
      await this.storage?.setItem?.(key, value);
    }
  }

  async removeItem(key: string): Promise<void> {
    if (this.useNativeStorage) {
      await this.nativeRemoveItem(key);
    } else {
      await this.storage?.removeItem?.(key);
    }
  }

  async storeAction(action: ActionSchema): Promise<void> {
    const storedAction: StoredAction = {
      ...action,
      lastModified: Date.now(),
      createdAt: Date.now(),
    };
    await this.setItem(`action:${action.id}`, JSON.stringify(storedAction));
  }

  async getAction(actionId: string): Promise<StoredAction | null> {
    const data = await this.getItem(`action:${actionId}`);
    if (!data) return null;
    return JSON.parse(data) as StoredAction;
  }

  async storeConfig(config: ConfigSchema): Promise<void> {
    const storedConfig: StoredConfig = {
      ...config,
      lastModified: Date.now(),
      createdAt: Date.now(),
    };
    await this.setItem('config', JSON.stringify(storedConfig));
  }

  async getConfig(): Promise<StoredConfig | null> {
    const data = await this.getItem('config');
    if (!data) return null;
    return JSON.parse(data) as StoredConfig;
  }

  async listStoredActions(): Promise<string[]> {
    if (this.useNativeStorage) {
      try {
        return await StreamPiModule.listKeys('action:');
      } catch (error) {
        console.warn('Native storage list failed:', error);
        return [];
      }
    }
    // For custom storage, we can't list keys unless implemented by the user
    return [];
  }
} 