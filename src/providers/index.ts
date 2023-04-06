import { type Disposable, languages, workspace, extensions } from 'vscode'
import LuaHoverProvider from '@/providers/luaHover'
import getConfig from '@/lib/utils/getConfig'
import LuaCompletionProvider from './luaCompletion'
import XMLCompletionProvider from './XMLCompletion'
import TSOCompletionProvider from './tsoCompletion'
import TSOHoverProvider from './tsoHover'
import { type HScopesAPI } from './hscopes'

export const virtualDocumentContents = new Map<string, string>()
export let hs: HScopesAPI

// export const getVirtualDocumentStorage = (): Map<string, string> => virtualDocumentContents

export default function registerProviders (): Disposable[] {
  const hsExt = extensions.getExtension<HScopesAPI>('draivin.hscopes')
  if (hsExt === undefined) throw new Error('HyperScopes Extension not installed')
  void hsExt.activate().then((api) => { hs = api })

  const results: Disposable[] = [
    workspace.registerTextDocumentContentProvider('tts-embedded-content', {
      provideTextDocumentContent: uri => {
        // Remove the extension from uri.path, and first slash character at beggining
        const originalUri = uri.path.slice(1).slice(0, uri.path.lastIndexOf('.') - 1)
        return virtualDocumentContents.get(decodeURIComponent(originalUri))
      }
    }),
    languages.registerHoverProvider('tso', new TSOHoverProvider()),
    languages.registerHoverProvider('lua', new LuaHoverProvider())
  ]
  if (getConfig<boolean>('autocompletion.luaEnabled')) {
    results.push(
      languages.registerCompletionItemProvider('lua', new LuaCompletionProvider(), ...['.', ':', '(', ')', ' '])
    )
  }
  if (getConfig<boolean>('autocompletion.xmlEnabled')) {
    results.push(
      languages.registerCompletionItemProvider('xml', new XMLCompletionProvider(), ...['<', '/', ' '])
    )
  }
  if (getConfig<boolean>('autocompletion.xmlEnabled') || getConfig<boolean>('autocompletion.luaEnabled')) {
    results.push(
      languages.registerCompletionItemProvider('tso', new TSOCompletionProvider(), ...['.', ':', '(', ')', ' ', '<', '/', ' '])
    )
  }
  return results
}
