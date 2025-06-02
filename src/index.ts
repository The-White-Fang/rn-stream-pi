export * from './StreamPiClient';
export * from './components/ActionButton';
export * from './components/ActionGrid';

// Types
export interface StreamPiMessage {
  type: string;
  data: any;
}

export interface StreamPiAction {
  id: string;
  type: 'normal' | 'toggle' | 'folder' | 'gauge';
  displayText: string;
  iconState?: string;
  isToggled?: boolean;
  isDisabled?: boolean;
  gaugeValue?: number;
  gaugeMin?: number;
  gaugeMax?: number;
}

export interface StreamPiProfile {
  id: string;
  name: string;
  rows: number;
  columns: number;
  actions: StreamPiAction[];
}

// Event Types
export type StreamPiEventType = 
  | 'connected'
  | 'disconnected'
  | 'error'
  | 'action'
  | 'profile'
  | 'config'; 