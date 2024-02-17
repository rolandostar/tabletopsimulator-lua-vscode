const path = require('path')
const TerserPlugin = require('terser-webpack-plugin');

const config = {
  target: ['web', 'es2020'],
  entry: './src/TTSConsole/webview.ts',
  mode: 'none',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'webview.js'
  },
  resolve: {
    extensions: [ ".ts", ".js"]
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      terserOptions: { format: { comments: false } },
      extractComments: false
    })]
  },
  module: {
    rules: [
    { test: /\.ts$/, use: 'ts-loader' }
    ]
  }
}

module.exports = (env, argv) => {
  if (argv.mode !== 'production') {
    config.optimization.minimize = false
    config.devtool = 'source-map'
  }
  return config
}
