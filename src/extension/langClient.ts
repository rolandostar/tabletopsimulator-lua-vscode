import {
  RevealOutputChannelOn, LanguageClient, TransportKind, type LanguageClientOptions
} from 'vscode-languageclient/node'
import { type ExtensionContext, window as Window } from 'vscode'
import { join as pJoin } from 'path'

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

export default (context: ExtensionContext): LanguageClient => {
  const serverModule = context.asAbsolutePath(pJoin('out', 'server.bundle.js'))
  const serverOptions = {
    module: serverModule,
    transport: TransportKind.ipc,
    options: { cwd: process.cwd() }
  }
  try {
    const client = new LanguageClient('UI Sample', {
      run: serverOptions,
      debug: serverOptions
    }, clientOptions)
    client.registerProposedFeatures()
    return client
  } catch (err) {
    void Window.showErrorMessage('The extension couldn\'t be started. See the output channel for details.')
    throw err
  }
}
