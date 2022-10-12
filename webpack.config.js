const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const config = {
  mode: 'none',
  target: 'node',
  resolve: {
    mainFields: ['module', 'main'],
    extensions: ['.ts', '.js'],
  },
  entry: './src/extension.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'extension.js',
    libraryTarget: 'commonjs2',
    clean: true
  },
  externals: {
    vscode: 'commonjs vscode',
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'node_modules/luabundle/bundle/runtime.lua' },
      ],
    }),
  ],
  optimization: {
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
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
      },
    ],
  },
};
module.exports = (env, argv) => {
  config.optimization.minimize = argv.mode === 'production'
  config.devtool = argv.mode === 'production' ? 'hidden-source-map' : 'eval-source-map'
  return config
};