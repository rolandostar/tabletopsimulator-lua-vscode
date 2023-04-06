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
    return [
      new CompletionItem('A suggestion')
    ]
  }
}
