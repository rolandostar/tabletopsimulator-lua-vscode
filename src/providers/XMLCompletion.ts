import getConfig from '@utils/getConfig'
import {
  CompletionItem, type CompletionList, type Position, type TextDocument,
  type CompletionItemProvider
} from 'vscode'
import { hs } from '.'

export default class XMLCompletionProvider implements CompletionItemProvider {
  public provideCompletionItems (
    document: TextDocument,
    position: Position
  ): CompletionItem[] | CompletionList<CompletionItem> {
    if (!getConfig<boolean>('autocompletion.xmlEnabled')) return []
    const range = document.getWordRangeAtPosition(position)
    const text = document.getText(range)
    console.log(text)
    const { scopes } = hs.getScopeAt(document, position) ?? { scopes: [] }
    console.log(scopes)
    return [
      new CompletionItem('An XML Suggestion')
    ]
  }
}
