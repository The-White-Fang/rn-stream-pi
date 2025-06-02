export interface ActionSchema {
  id: string;
  type: 'normal' | 'toggle' | 'folder' | 'gauge';
  displayText: string;
  iconState?: string;
  isToggled?: boolean;
  isDisabled?: boolean;
  gaugeValue?: number;
  gaugeMin?: number;
  gaugeMax?: number;
  // Custom properties for user extensions
  [key: string]: any;
}

export interface ConfigSchema {
  serverUrl: string;
  clientName: string;
  version: string;
  // Optional storage configuration
  storage?: {
    type: 'native' | 'custom';
    // For custom storage implementations
    getItem?: (key: string) => Promise<string | null>;
    setItem?: (key: string, value: string) => Promise<void>;
    removeItem?: (key: string) => Promise<void>;
  };
  // Custom properties for user extensions
  [key: string]: any;
}

export interface StoredAction extends ActionSchema {
  lastModified: number;
  createdAt: number;
}

export interface StoredConfig extends ConfigSchema {
  lastModified: number;
  createdAt: number;
}

// Type guard for checking if an object matches the ActionSchema
export function isActionSchema(obj: any): obj is ActionSchema {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'string' &&
    typeof obj.type === 'string' &&
    ['normal', 'toggle', 'folder', 'gauge'].includes(obj.type) &&
    typeof obj.displayText === 'string'
  );
}

// Type guard for checking if an object matches the ConfigSchema
export function isConfigSchema(obj: any): obj is ConfigSchema {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.serverUrl === 'string' &&
    typeof obj.clientName === 'string' &&
    typeof obj.version === 'string'
  );
} 