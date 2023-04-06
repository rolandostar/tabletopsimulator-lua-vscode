import { workspace } from 'vscode'

export default function getConfig<T> (config: string, root = 'ttslua'): T {
  const c: T | undefined = workspace.getConfiguration(root).get(config)
  if (c === undefined) throw new Error(`Config ${config} not found`)
  return c
}
