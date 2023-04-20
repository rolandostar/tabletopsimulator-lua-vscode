const path = require('path')
const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const config = {
  mode: 'none',
  target: 'node',
  node: {
    __dirname: false // leave the __dirname-behaviour intact
  },
  resolve: {
    mainFields: ['module', 'main'],
    extensions: ['.ts', '.js'],
    plugins: [new TsconfigPathsPlugin()]
  },
  entry: {
    client: './src/extension/index.ts',
    // server: './server/index.ts'
  },
  output: {
    path: path.resolve(__dirname, 'out'),
    filename: '[name].bundle.js',
    libraryTarget: 'commonjs2',
    clean: true
  },
  externals: {
    vscode: 'commonjs vscode'
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'node_modules/luabundle/bundle/runtime.lua' },
      ],
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      terserOptions: {
        format: {
          comments: false,
        },
      },
      extractComments: false,
    })],
  },
  module: {
    rules: [{
      test: /\.ts$/,
      exclude: /node_modules/,
      use: [{
        loader: 'ts-loader',
        options: {
          compilerOptions: {
            sourceMap: true
          }
        }
      }]
    }]
  }
}
module.exports = (env, argv) => {
  if (argv.mode !== 'production') {
    config.optimization.minimize = false
    config.devtool = 'source-map'
  }
  return config
}
