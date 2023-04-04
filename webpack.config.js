const path = require('path')
const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin')

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
    server: './server/index.ts'
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
    // new CopyWebpackPlugin({
    //   patterns: [
    //     { from: 'node_modules/luabundle/bundle/runtime.lua' },
    //   ],
    // }),
  ],
  optimization: {
    // minimizer: [new TerserPlugin({
    //   terserOptions: {
    //     format: {
    //       comments: false,
    //     },
    //   },
    //   extractComments: false,
    // })],
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
  config.optimization.minimize = argv.mode === 'production'
  config.devtool = argv.mode === 'production' ? 'hidden-source-map' : 'source-map'
  return config
}
