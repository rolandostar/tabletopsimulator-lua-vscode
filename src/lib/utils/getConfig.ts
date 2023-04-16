/**
 * @file Get Config Utility
 * This utility function is used to get a configuration value from the extension's configuration.
 * configurations are defined in package.json.
 * By default this function prefixes the config with `ttslua.`.
 */

import { workspace } from 'vscode'

export default function getConfig<T> (config: string, root = 'ttslua'): T {
  const c: T | undefined = workspace.getConfiguration(root).get(config)
  if (c === undefined) throw new Error(`Config ${config} not found`)
  return c
}
