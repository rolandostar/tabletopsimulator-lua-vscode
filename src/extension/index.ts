/**
 * @file Extension Entry Point
 * This is the extension entry point, when the extension is loaded by VS Code. It calls the
 * `activate` function and passes the extension context.
 *
 * In order:
 * 1. Set the storage
 * 2. Init the workspace
 * 3. Init the TTS Service
 * 4. Register the commands
 * 5. Register completion providers
 */

import { type ExtensionContext, commands } from 'vscode'

import myCommands from './commands'
import { start as TTSServiceInit } from '@/TTSService'
import { setStorage, set } from '@utils/LocalStorageService'
import { initWorkspace } from '@/vscode/workspaceManager'
import registerProviders from '@/providers'
import L from '@/i18n'

export async function activate (context: ExtensionContext): Promise<void> {
  console.info(L.activation())
  setStorage(context.globalState, context.globalStorageUri)
  await set('extensionPath', context.extensionPath)

  context.subscriptions.push(
    await initWorkspace(),
    ...await TTSServiceInit(),
    ...myCommands.map(cmd => commands.registerCommand(cmd.id, cmd.fn, context)),
    ...registerProviders()
  )
}

export function deactivate (): void {
}
