import { type Uri, extensions } from 'vscode'

export default function getExtensionUri (): Uri {
  const ext = extensions.getExtension('rolandostar.tabletopsimulator-lua')
  if (ext === undefined) throw new Error('Extension not found')
  return ext.extensionUri
}
