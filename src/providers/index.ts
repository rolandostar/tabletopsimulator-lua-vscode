import { type Disposable, languages, workspace, extensions } from 'vscode'
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

  return [
    /**
     * This provider is used to create virtual documents for embedded scopes
     * When a command is executed with a virtual document uri, the contents of the virtual document
     * are resolved using this function. Which is performed via simple Map lookup.
     */
    workspace.registerTextDocumentContentProvider('tts-embedded-content', {
      provideTextDocumentContent: uri => {
        // Remove the last extension from uri.path (Authority), and first slash character at beggining
        // This is done to recreate the key used to store the virtual document contents
        const originalUri = uri.path.slice(1).slice(0, uri.path.lastIndexOf('.') - 1)
        return virtualDocumentContents.get(decodeURIComponent(originalUri))
      }
    }),
    languages.registerHoverProvider('tso', new TSOHoverProvider()),
    languages.registerHoverProvider('lua', new LuaHoverProvider()),
    languages.registerCompletionItemProvider('tso', new TSOCompletionProvider()),
    languages.registerCompletionItemProvider('lua', new LuaCompletionProvider(), '.', ':', '(', ')', ' '),
    languages.registerCompletionItemProvider('xml', new XMLCompletionProvider(), '<', '/', ' '),
    languages.registerCompletionItemProvider('yaml', new YAMLCompletionProvider())
  ]
}
