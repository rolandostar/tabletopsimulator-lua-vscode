/* eslint-disable no-empty, import/no-dynamic-require, global-require, import/no-unresolved */
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// Our util/getCoreNodeModule.js file uses a dynamic require that depends on the environment and so
// has to be excluded from webpack'ing, and we'll just copy it to the distribution folder.

// Since webpack shouldn't have to depend on npm build to transpile, we keep this file in .js.

Object.defineProperty(exports, '__esModule', { value: true });
const vscode = require('vscode');

/**
 * Returns a node module installed with VSCode, or undefined if it fails.
 */
function getCoreNodeModule(moduleName) {
  try {
    return require(`${vscode.env.appRoot}/node_modules.asar/${moduleName}`);
  } catch (err) { }
  try {
    return require(`${vscode.env.appRoot}/node_modules/${moduleName}`);
  } catch (err) { }
  return undefined;
}

exports.getCoreNodeModule = getCoreNodeModule;
