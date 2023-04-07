import {
  type CancellationToken, type CompletionContext, type CompletionItem, type CompletionList,
  type Position, type TextDocument, type CompletionItemProvider, commands, Uri
} from 'vscode'
import { hs, virtualDocumentContents } from '.'
import { SnippetString } from 'vscode'
import * as Sections from '@utils/sectionHandler'
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
    switch (true) {
      // If no scopes found, do nothing
      case scopes.length === 0: return []
      // If the scope is any of the embedded scopes, delegate to the appropriate language server
      case scopes.length > 1:
        if (scopes[1] === 'embedded.lua' || scopes[1] === 'embedded.xml' || scopes[1] === 'embedded.yaml') {
          // extract what comes after 'embedded'
          const authority = scopes[1].split('.')[1]
          const originalUri = document.uri.toString(true)
          const vdocContent = Sections.extract(Sections.AuthorityToType[authority], document)
          virtualDocumentContents.set(originalUri, vdocContent)
          return await Promise.resolve(commands.executeCommand<CompletionList>(
            'vscode.executeCompletionItemProvider',
            Uri.parse(`tts-embedded-content://${authority}/${encodeURIComponent(document.uri.toString(true))}.${authority}`),
            position,
            context.triggerCharacter
          ))
        } else return []
      // If the scope is the root scope, provide suggestions for the root scope
      case scopes.length === 1:
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
