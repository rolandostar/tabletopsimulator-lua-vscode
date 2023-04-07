import getConfig from '@utils/getConfig'
import {
  type CancellationToken, type CompletionContext, CompletionItem, type CompletionList,
  type Position, type TextDocument, type CompletionItemProvider
} from 'vscode'

export default class LuaCompletionProvider implements CompletionItemProvider {
  public async provideCompletionItems (
    document: TextDocument,
    position: Position,
    _token: CancellationToken,
    context: CompletionContext
  ): Promise<CompletionItem[] | CompletionList> {
    if (!getConfig<boolean>('autocompletion.luaEnabled')) return []
    return [
      new CompletionItem('A Lua suggestion')
    ]
  }
}
