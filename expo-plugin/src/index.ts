import { ConfigPlugin, createRunOncePlugin, withPlugins, ExpoConfig } from '@expo/config-plugins';
import { withStreamPiAndroid } from './withAndroidPlugin';

const pkg = require('rn-stream-pi/package.json');

const withStreamPi: ConfigPlugin = (config: ExpoConfig) => {
  return withPlugins(config, [
    // Add Android configuration
    withStreamPiAndroid,
    // iOS configuration can be added here in the future
  ]);
};

export default createRunOncePlugin(withStreamPi, pkg.name, pkg.version); 