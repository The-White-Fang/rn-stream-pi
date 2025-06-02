# React Native Stream-Pi

A React Native client implementation for [Stream-Pi](https://stream-pi.com/), an open-source, cross-platform macro pad application.

## Features

- 🔄 Real-time communication with Stream-Pi server
- 📱 Native Android support
- 🎨 Customizable UI components
- 🔌 WebSocket-based communication
- 🎯 Type-safe implementation
- 📊 Support for all Stream-Pi action types (Normal, Toggle, Folder, Gauge)

## Installation

```bash
npm install rn-stream-pi
# or
yarn add rn-stream-pi
```

### Android Setup

Add the following to your `android/app/build.gradle`:

```gradle
dependencies {
    // ... other dependencies
    implementation project(':rn-stream-pi')
}
```

Add the following to your `android/settings.gradle`:

```gradle
include ':rn-stream-pi'
project(':rn-stream-pi').projectDir = new File(rootProject.projectDir, '../node_modules/rn-stream-pi/android')
```

## Usage

### Basic Setup

```typescript
import { StreamPiClient, ActionGrid } from 'rn-stream-pi';

// Initialize the client
const client = new StreamPiClient({
  serverHost: '192.168.1.100',  // Your Stream-Pi server IP
  serverPort: 9999,             // Your Stream-Pi server port
  clientName: 'My RN Client',   // Client name to display in server
  version: '1.0.0'             // Client version
});

// Connect to server
await client.initialize();

// Listen for events
client.on('connected', () => {
  console.log('Connected to server!');
});

client.on('action', (action) => {
  console.log('Action received:', action);
});

// Handle disconnection
client.on('disconnected', () => {
  console.log('Disconnected from server');
});
```

### Using UI Components

```typescript
import React, { useState } from 'react';
import { View } from 'react-native';
import { ActionGrid, StreamPiAction } from 'rn-stream-pi';

const ActionScreen: React.FC = () => {
  const [actions, setActions] = useState<StreamPiAction[]>([]);

  const handleActionPress = (actionId: string) => {
    // Handle action press
  };

  return (
    <View style={{ flex: 1 }}>
      <ActionGrid
        actions={actions}
        columns={4}
        gap={8}
        onActionPress={handleActionPress}
      />
    </View>
  );
};
```

### Action Types

The package supports all Stream-Pi action types:

```typescript
type ActionType = 'normal' | 'toggle' | 'folder' | 'gauge';

interface StreamPiAction {
  id: string;
  type: ActionType;
  displayText: string;
  iconState?: string;
  isToggled?: boolean;
  isDisabled?: boolean;
  gaugeValue?: number;
  gaugeMin?: number;
  gaugeMax?: number;
}
```

## API Reference

### StreamPiClient

Main client class for communicating with the Stream-Pi server.

#### Methods

- `initialize()`: Connect to server and set up the client
- `disconnect()`: Disconnect from server
- `sendMessage(message: WebSocketMessage)`: Send a message to server
- `getStoragePath()`: Get the app's storage path

#### Events

- `'connected'`: Emitted when connected to server
- `'disconnected'`: Emitted when disconnected from server
- `'error'`: Emitted when an error occurs
- `'action'`: Emitted when an action is received
- `'profile'`: Emitted when profile data is received
- `'config'`: Emitted when configuration data is received

### UI Components

#### ActionButton

A customizable button component for actions.

```typescript
interface ActionButtonProps {
  id: string;
  displayText: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  isToggled?: boolean;
  isDisabled?: boolean;
}
```

#### ActionGrid

A grid layout component for displaying actions.

```typescript
interface ActionGridProps {
  actions: Action[];
  columns: number;
  gap?: number;
  style?: ViewStyle;
  onActionPress: (actionId: string) => void;
}
```

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## License

This project is licensed under the GPL-3.0 License - see the [LICENSE](LICENSE) file for details.

## Related

- [Stream-Pi Server](https://github.com/stream-pi/server)
- [Stream-Pi Client](https://github.com/stream-pi/client)
- [Stream-Pi Action API](https://github.com/stream-pi/action-api)

## Support

For support, please:

1. Check the [documentation](https://stream-pi.com/documentation)
2. Open an issue in this repository
3. Join our [Discord community](https://discord.gg/BExqGmk) 