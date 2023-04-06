import { type Disposable, languages } from 'vscode'
import TTSHoverProvider from '@/providers/hover'
import getConfig from '@/lib/utils/getConfig'
import LuaCompletionProvider from './luaCompletion'
import XMLCompletionProvider from './XMLCompletion'

export default function registerProviders (): Disposable[] {
  const results: Disposable[] = [
    languages.registerHoverProvider('lua', new TTSHoverProvider())
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
  return results
}
