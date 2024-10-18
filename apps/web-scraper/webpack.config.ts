import GenerateJsonPlugin from 'generate-json-webpack-plugin'
import path from 'path'
import webpack from 'webpack'

const isDevelopment = process.env.NODE_ENV === 'development'

const config: webpack.Configuration = {
  mode: isDevelopment ? 'development' : 'production',
  devtool: isDevelopment ? 'inline-source-map' : false,
  target: 'node',
  context: path.join(__dirname, 'src'),
  entry: {
    index: `./index.ts`
  },
  optimization: { minimize: false },
  output: {
    path: path.join(__dirname, 'dist', 'web-scraper'),
    filename: 'index.js',
    libraryTarget: 'commonjs'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: [/node_modules/],
        use: ['ts-loader']
      }
    ]
  },
  plugins: [
    new GenerateJsonPlugin('package.json', {
      name: 'web-scraper',
      private: true,
      main: 'index.js'
    }) as any
  ]
}

export default config