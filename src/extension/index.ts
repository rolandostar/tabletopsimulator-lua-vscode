import { type ExtensionContext, commands, Disposable } from 'vscode'

import myCommands from './commands'
import langClientBuilder from './langClient'
import TTSService from '@/TTSService'
import { setLocalStorage } from '@Utils/LocalStorageService'
import { initWorkspace } from '@/vscode/workspaceManager'
import registerProviders from '@/providers'
import L from '@/i18n'

export async function activate (context: ExtensionContext): Promise<void> {
  console.info(L.activation())
  setLocalStorage(context.globalState)
  const langClient = langClientBuilder(context)

  context.subscriptions.push(
    new Disposable(langClient.dispose),
    await initWorkspace(),
    await TTSService.getInstance().start(),
    ...myCommands.map(cmd => commands.registerCommand(cmd.id, cmd.fn, context)),
    ...registerProviders()
  )

  await langClient.start()
}

export function deactivate (): void {
}
