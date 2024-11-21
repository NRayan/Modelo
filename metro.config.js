const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(__dirname);

// Adicionando a extensão `.bin` à lista de `assetExts`
const config = {
  resolver: {
    assetExts: [...defaultConfig.resolver.assetExts, 'bin'],
  },
};

module.exports = mergeConfig(defaultConfig, config);