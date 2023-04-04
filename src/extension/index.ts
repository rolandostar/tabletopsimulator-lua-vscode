import * as path from 'path'
import { type ExtensionContext, window as Window, commands as vsCommands } from 'vscode'
import {
  RevealOutputChannelOn, LanguageClient, TransportKind,
  type ServerOptions, type LanguageClientOptions
} from 'vscode-languageclient/node'
import TTSService from '../TTSService'
import commands from './commands'

export async function activate (context: ExtensionContext): Promise<void> {
  console.log('[TTSLua] Activating extension')
  const serverModule = context.asAbsolutePath(path.join('out', 'server.bundle.js'))
  console.log(serverModule)
  const serverOptions: ServerOptions = {
    run: { module: serverModule, transport: TransportKind.ipc, options: { cwd: process.cwd() } },
    debug: { module: serverModule, transport: TransportKind.ipc, options: { cwd: process.cwd() } }
  }

  const clientOptions: LanguageClientOptions = {
    documentSelector: [{ scheme: 'file', language: 'plaintext' }],
    diagnosticCollectionName: 'sample',
    revealOutputChannelOn: RevealOutputChannelOn.Never,
    progressOnInitialization: true,
    middleware: {
      executeCommand: async (command, args, next) => {
        const selected = await Window.showQuickPick(['Visual Studio', 'Visual Studio Code'])
        if (selected === undefined) {
          return next(command, args)
        }
        args = args.slice(0)
        args.push(selected)
        return next(command, args)
      }
    }
  }

  let client: LanguageClient
  try {
    client = new LanguageClient('UI Sample', serverOptions, clientOptions)
  } catch (err) {
    await Window.showErrorMessage('The extension couldn\'t be started. See the output channel for details.')
    return
  }
  client.registerProposedFeatures()
  await client.start()

  console.log('[TTSLua] Tabletop Simulator Extension Load')
  await TTSService.start()

  context.subscriptions.push(
    ...commands.map(cmd => vsCommands.registerCommand(cmd.id, cmd.fn, context))
  )
}

export function deactivate (): void {
}
