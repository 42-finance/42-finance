const { getSentryExpoConfig } = require('@sentry/react-native/metro')
const path = require('path')

// eslint-disable-next-line no-undef
const projectRoot = __dirname
const monorepoRoot = path.resolve(projectRoot, '../..')

const config = getSentryExpoConfig(projectRoot)
config.watchFolders = [monorepoRoot]
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules')
]

module.exports = config
