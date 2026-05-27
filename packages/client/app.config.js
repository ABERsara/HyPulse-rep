const APP_ENV = process.env.APP_ENV || 'development';

const envConfig = {
  development: {
    name: 'HyPulse (dev)',
    bundleIdentifier: 'com.yourname.worldplay.development',
    androidPackage: 'com.yourname.worldplay.development',
  },
  staging: {
    name: 'HyPulse (staging)',
    bundleIdentifier: 'com.yourname.worldplay.staging',
    androidPackage: 'com.yourname.worldplay.staging',
  },
  production: {
    name: 'HyPulse',
    bundleIdentifier: 'com.yourname.worldplay',
    androidPackage: 'com.yourname.worldplay',
  },
};

const env = envConfig[APP_ENV] || envConfig.development;

export default ({ config }) => ({
  ...config,
  name: env.name,
  ios: {
    ...config.ios,
    bundleIdentifier: env.bundleIdentifier,
  },
  android: {
    ...config.android,
    package: env.androidPackage,
  },
});
