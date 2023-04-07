import getConfig from '@utils/getConfig'
import {
  CompletionItem, type CompletionList, type Position, type TextDocument,
  type CompletionItemProvider
} from 'vscode'

export default class XMLCompletionProvider implements CompletionItemProvider {
  public async provideCompletionItems (
    document: TextDocument,
    position: Position
  ): Promise<CompletionItem[] | CompletionList> {
    if (!getConfig<boolean>('autocompletion.xmlEnabled')) return []
    return [
      new CompletionItem('An XML Suggestion')
    ]
  }
}
