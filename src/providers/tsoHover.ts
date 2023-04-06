import { type HoverProvider, type TextDocument, type Position, type Hover, commands, Uri } from 'vscode'
import { virtualDocumentContents } from '.'

export default class TSOHoverProvider implements HoverProvider {
  async provideHover (document: TextDocument, position: Position): Promise<Hover | null> {
    if (true) { // Detect if it's in lua
      const originalUri = document.uri.toString(true)
      console.log('setting', originalUri)
      virtualDocumentContents.set(originalUri, document.getText())
      const vdocUriString = `tts-embedded-content://lua/${encodeURIComponent(
        originalUri
      )}.lua`
      const vdocUri = Uri.parse(vdocUriString)
      return await commands.executeCommand<Hover | null>(
        'vscode.executeHoverProvider',
        vdocUri,
        position
      )
    }
  }
}
