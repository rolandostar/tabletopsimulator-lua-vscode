import { type Disposable, languages, workspace, extensions, type Uri, window } from 'vscode'
import { type HScopesAPI } from './hscopes'
import LuaCompletionProvider from './luaCompletion'
import XMLCompletionProvider from './XMLCompletion'
import TSOCompletionProvider from './tsoCompletion'
import YAMLCompletionProvider from './yamlCompletion'

import TSOHoverProvider from './tsoHover'
import LuaHoverProvider from './luaHover'

// Expose a map of virtual documents to the rest of the providers
export const virtualDocumentContents = new Map<string, string>()
export let hs: HScopesAPI

const [
  luaCompletionProvider,
  tsoCompletionProvider,
  xmlCompletionProvider,
  yamlCompletionProvider,
  tsoHoverProvider,
  luaHoverProvider
] = [
  new LuaCompletionProvider(),
  new TSOCompletionProvider(),
  new XMLCompletionProvider(),
  new YAMLCompletionProvider(),
  new TSOHoverProvider(),
  new LuaHoverProvider()
]

/**
 * This provider is used to create virtual documents for embedded scopes
 * When a command is executed with a virtual document uri, the contents of the virtual document
 * are resolved using this function. Which is performed via simple Map lookup.
 */
const ttsEmbeddedContentProvider = {
  provideTextDocumentContent: (uri: Uri) => {
    // Remove the last extension from uri.path (Authority), and first slash character at beggining
    // This is done to recreate the key used to store the virtual document contents
    const originalUri = uri.path.slice(1).slice(0, uri.path.lastIndexOf('.') - 1)
    return virtualDocumentContents.get(decodeURIComponent(originalUri))
  }
}

/**
 * Registers all providers for this extension
 * @returns An array of Disposables to be disposed when the extension is deactivated
 */
export default function registerProviders (): Disposable[] {
  // Activate the HyperScopes extension
  const hsExt = extensions.getExtension<HScopesAPI>('draivin.hscopes')
  if (hsExt === undefined) throw new Error('HyperScopes Extension not installed')
  // Expose the HyperScopes API to the rest of the providers
  void hsExt.activate().then((api) => { hs = api })
  luaCompletionProvider.preload().catch((err: Error) => {
    // If it's a type error it's probably because the API changed
    if (err instanceof TypeError) {
      void window.showErrorMessage('Failed to preload Lua API, please report this issue to the extension author. Autocompletion disabled')
      throw Error(`Failed to preload Lua API: ${err.message}`)
    }
    throw err
  })
  return [
    languages.registerHoverProvider('tso', tsoHoverProvider),
    languages.registerHoverProvider('lua', luaHoverProvider),
    languages.registerCompletionItemProvider('tso', tsoCompletionProvider),
    languages.registerCompletionItemProvider('yaml', yamlCompletionProvider),
    languages.registerCompletionItemProvider('xml', xmlCompletionProvider, '<', '/', ' '),
    languages.registerCompletionItemProvider('lua', luaCompletionProvider, '.', ':', '(', ')', ' '),
    workspace.registerTextDocumentContentProvider('tts-embedded-content', ttsEmbeddedContentProvider)
  ]
}
