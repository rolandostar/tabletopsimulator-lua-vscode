/**
 * @file YAML Completion Provider
 * Currently unused
 */

// import getConfig from '@/utils/getConfig'
import {
  type CancellationToken, type CompletionContext, type CompletionItem, type CompletionList,
  type Position, type TextDocument, type CompletionItemProvider
} from 'vscode'

export default class YAMLCompletionProvider implements CompletionItemProvider {
  public async provideCompletionItems (
    document: TextDocument,
    position: Position,
    _token: CancellationToken,
    context: CompletionContext
  ): Promise<CompletionItem[] | CompletionList> {
    // if (!getConfig<boolean>('autocompletion.yamlEnabled')) return []
    // const range = document.getWordRangeAtPosition(position)
    // const text = document.getText(range)
    // console.log(text)
    return [
      // new CompletionItem('A YAML suggestion')
    ]
  }
}
