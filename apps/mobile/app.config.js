module.exports = ({ config }) => {
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
    ...config,
    name: appName,
    android: {
      ...config.android,
      googleServicesFile: process.env.GOOGLE_SERVICES,
      package: bundleIdentifier
    },
    ios: {
      ...config.ios,
      bundleIdentifier
    }
  }
}
