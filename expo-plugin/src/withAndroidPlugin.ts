import { ConfigPlugin, withAndroidManifest, withProjectBuildGradle, AndroidConfig } from '@expo/config-plugins';

type ExpoConfig = {
  modResults: {
    contents: string;
    manifest: {
      application: any[];
      'uses-permission'?: Array<{
        $: {
          'android:name': string;
        };
      }>;
    };
  };
};

export const withStreamPiAndroid: ConfigPlugin = (config) => {
  // Add Android project configuration
  config = withProjectBuildGradle(config, (gradleConfig: ExpoConfig) => {
    if (gradleConfig.modResults.contents.includes('rn-stream-pi')) {
      return gradleConfig;
    }

    const buildScript = gradleConfig.modResults.contents;
    const pattern = /allprojects\s*{\s*repositories\s*{/;
    const newRepository = `
        maven {
            url "$rootDir/../node_modules/rn-stream-pi/android/maven"
        }`;

    if (pattern.test(buildScript)) {
      gradleConfig.modResults.contents = buildScript.replace(
        pattern,
        (match: string) => `${match}\n${newRepository}`
      );
    }

    return gradleConfig;
  });

  // Add required permissions to AndroidManifest.xml
  config = withAndroidManifest(config, (manifestConfig: ExpoConfig) => {
    const mainApplication = manifestConfig.modResults.manifest.application[0];

    // Add permissions
    const permissions = [
      'android.permission.INTERNET',
      'android.permission.ACCESS_NETWORK_STATE',
    ];

    permissions.forEach((permission) => {
      if (!manifestConfig.modResults.manifest['uses-permission']?.some(
        (item) => item.$['android:name'] === permission
      )) {
        manifestConfig.modResults.manifest['uses-permission'] = [
          ...(manifestConfig.modResults.manifest['uses-permission'] || []),
          {
            $: {
              'android:name': permission,
            },
          },
        ];
      }
    });

    return manifestConfig;
  });

  return config;
}; 