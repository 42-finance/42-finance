import * as dotenv from 'dotenv'
import { ExpoConfig } from 'expo/config'

dotenv.config()

export default (): ExpoConfig => {
  const getAppName = () => {
    if (process.env.APP_VARIANT === 'development') {
      return '42 Finance (Dev)'
    }

    if (process.env.APP_VARIANT === 'preview') {
      return '42 Finance (Preview)'
    }

    return '42 Finance'
  }

  const getBundleIdentifier = () => {
    if (process.env.APP_VARIANT === 'development') {
      return 'com.fortytwofinance.app.development'
    }

    if (process.env.APP_VARIANT === 'preview') {
      return 'com.fortytwofinance.app.preview'
    }

    return 'com.fortytwofinance.app'
  }

  const appName = getAppName()

  const bundleIdentifier = getBundleIdentifier()

  return {
    name: appName,
    slug: 'fortytwofinance',
    version: '1.1.1',
    orientation: 'portrait',
    icon: './src/assets/images/icon.png',
    scheme: 'fortytwofinance',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './src/assets/images/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff'
    },
    updates: {
      fallbackToCacheTimeout: 0,
      url: process.env.EAS_UPDATES_URL
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      associatedDomains: [
        'applinks:42f.io',
        'applinks:app.42f.io',
        'applinks:42finance.io',
        'applinks:fortytwof.com',
        'applinks:fortytwofinance.com',
        'webcredentials:42f.io'
      ],
      bundleIdentifier,
      config: {
        usesNonExemptEncryption: false
      },
      icon: './src/assets/images/icon-ios.png',
      privacyManifests: {
        NSPrivacyAccessedAPITypes: [
          {
            NSPrivacyAccessedAPIType: 'NSPrivacyAccessedAPICategoryDiskSpace',
            NSPrivacyAccessedAPITypeReasons: ['E174.1']
          },
          {
            NSPrivacyAccessedAPIType: 'NSPrivacyAccessedAPICategorySystemBootTime',
            NSPrivacyAccessedAPITypeReasons: ['8FFB.1']
          },
          {
            NSPrivacyAccessedAPIType: 'NSPrivacyAccessedAPICategoryFileTimestamp',
            NSPrivacyAccessedAPITypeReasons: ['C617.1']
          },
          {
            NSPrivacyAccessedAPIType: 'NSPrivacyAccessedAPICategoryUserDefaults',
            NSPrivacyAccessedAPITypeReasons: ['CA92.1']
          }
        ]
      },
      supportsTablet: true,
      usesAppleSignIn: true
    },
    android: {
      googleServicesFile: process.env.GOOGLE_SERVICES,
      icon: './src/assets/images/icon.png',
      package: bundleIdentifier
    },
    extra: {
      eas: {
        projectId: process.env.EAS_PROJECTID
      }
    },
    runtimeVersion: {
      policy: 'appVersion'
    },
    plugins: [
      [
        'expo-build-properties',
        {
          ios: {
            deploymentTarget: '14.0'
          }
        }
      ],
      [
        '@sentry/react-native/expo',
        {
          organization: process.env.SENTRY_ORGANIZATION,
          project: process.env.SENTRY_PROJECT
        }
      ],
      ['expo-apple-authentication'],
      'expo-asset',
      'expo-font',
      'expo-secure-store'
    ]
  }
}
