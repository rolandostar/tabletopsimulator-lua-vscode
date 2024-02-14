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
import TTSService from '@/TTSService'
import * as state from '@/utils/LocalStorageService'
import { initWorkspace } from '@/vscode/workspaceManager'
import registerProviders from '@/providers'
import L from '@/i18n'

export async function activate (context: ExtensionContext): Promise<void> {
  // L is the i18n object, which is used to get localized strings
  console.info(L.activation())

  // Storage is a persistent storage the extension uses for settings and state across sessions
  state.setStorageRef(context.globalState, context.globalStorageUri)
  await state.set('extensionPath', context.extensionPath)

  // All of these must return disposable objects, which will unload along with the extension
  context.subscriptions.push(
    await initWorkspace(),
    ...await TTSService.getInstance().init(),
    ...myCommands.map(cmd => commands.registerCommand(cmd.id, cmd.fn, context)),
    ...registerProviders()
  )
}

export function deactivate (): void {
}
