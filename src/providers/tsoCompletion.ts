import {
  type CancellationToken, type CompletionContext, type CompletionItem, type CompletionList,
  type Position, type TextDocument, type CompletionItemProvider, commands, Uri, type SemanticTokens
} from 'vscode'
import { hs, virtualDocumentContents } from '.'

export default class TSOCompletionProvider implements CompletionItemProvider {
  public async provideCompletionItems (
    document: TextDocument,
    position: Position,
    _token: CancellationToken,
    context: CompletionContext
  ): Promise<CompletionItem[] | CompletionList> {
    const token = hs.getScopeAt(document, position)

    const originalUri = document.uri.toString(true)
    virtualDocumentContents.set(originalUri, document.getText())
    let vdocUriString: string
    if (false) {
      vdocUriString = `tts-embedded-content://lua/${encodeURIComponent(
        originalUri
      )}.lua`
    } else {
      vdocUriString = `tts-embedded-content://xml/${encodeURIComponent(
        originalUri
      )}.xml`
    }

    const vdocUri = Uri.parse(vdocUriString)
    return await Promise.resolve(commands.executeCommand<CompletionList>(
      'vscode.executeCompletionItemProvider',
      vdocUri,
      position,
      context.triggerCharacter
    ))
  }
}
