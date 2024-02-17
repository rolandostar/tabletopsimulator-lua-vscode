const webpackWebConfig = require("./webpack.config.web.js");
const webpackNodeConfig = require("./webpack.config.node.js");

module.exports = [
  webpackNodeConfig,
  webpackWebConfig
];
