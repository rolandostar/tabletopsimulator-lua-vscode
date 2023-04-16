/**
 * @file TSO Completion Provider
 * This provider is used to provide completion items for the root scope of a TSO document.
 * It will delegate to the appropriate language server when the cursor is in an embedded scope.
 */

import {
  type CancellationToken, type CompletionContext, type CompletionItem, type CompletionList,
  type Position, type TextDocument, type CompletionItemProvider
} from 'vscode'
import { hs } from '.'
import { SnippetString } from 'vscode'
import executeVirtualCommand from '@utils/requestForwarder'
/**
 * Provides completion items for the root scope of a TSO document
 * @implements {CompletionItemProvider}
 *
 * Similar to the hover provider, this class will delegate to the appropriate language server
 * when the cursor is in an embedded scope. Additionally, it will provide suggestions for the
 * root scope.
 */
export default class TSOCompletionProvider implements CompletionItemProvider {
  public async provideCompletionItems (
    document: TextDocument,
    position: Position,
    _token: CancellationToken,
    context: CompletionContext
  ): Promise<CompletionItem[] | CompletionList> {
    const { scopes } = hs.getScopeAt(document, position) ?? { scopes: [] }
    // If the scope is any of the embedded scopes, delegate to the appropriate language server
    if (scopes.length > 1) {
      return await executeVirtualCommand<CompletionList>({
        command: 'vscode.executeCompletionItemProvider',
        allowedAuthorities: ['lua', 'xml', 'yaml'],
        triggerCharacter: context.triggerCharacter,
        document,
        position
      }) ?? []
    } else if (scopes.length === 1 && scopes[0] === 'source.tso') {
      return [
        {
          label: 'script',
          kind: 22,
          detail: 'Begin script block',
          documentation: 'Use a script block for custom behaviour written in lua',
          insertText: new SnippetString('```script\n$0\n```'),
          sortText: 'a'
        },
        {
          label: 'user interface',
          kind: 15,
          detail: 'Begin user interface block',
          documentation: 'Use a user interface block to define custom UI elements',
          insertText: new SnippetString('```ui\n$0\n```'),
          sortText: 'b'
        },
        {
          label: 'game object',
          kind: 9,
          detail: 'Begin game object block',
          documentation: 'Use a game object block to define the object\'s properties',
          insertText: new SnippetString('```object\n$0\n```'),
          sortText: 'c'
        }
      ]
    }

    return []
  }
}
