const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const config = {
  mode: 'none',
  target: 'node', // vscode extensions run in a Node.js-context 📖 -> https://webpack.js.org/configuration/node/
  // context: path.resolve(__dirname, 'src'),
  node: {
    __dirname: false,
  },
  resolve: {
    // support reading TypeScript and JavaScript files, 📖 -> https://github.com/TypeStrong/ts-loader
    mainFields: ['module', 'main'],
    extensions: ['.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    }
  },
  entry: './src/extension.ts', // the entry point of this extension, 📖 -> https://webpack.js.org/configuration/entry-context/
  output: {
    // the bundle is stored in the 'dist' folder (check package.json), 📖 -> https://webpack.js.org/configuration/output/
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
    libraryTarget: 'commonjs2',
    // devtoolModuleFilenameTemplate: '../[resource-path]',
    clean: true
  },
  externals: {
    vscode: 'commonjs vscode', // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
    // luabundle: 'commonjs luabundle',
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        // getCoreNodeModule.js -> dist/node_modules/getCoreNodeModule.js
        // { from: './src/utils/getCoreNodeModule.js', to: 'node_modules' },
        // { from: './src/language/syntaxes', to: 'syntaxes' },
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
  config.devtool = argv.mode === 'production' ? false : 'eval-source-map'
  return config
};