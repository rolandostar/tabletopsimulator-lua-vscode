import { type HoverProvider, type TextDocument, type Position, type Hover, commands, Uri } from 'vscode'
import { hs, virtualDocumentContents } from '.'
import * as vDocContent from '@/lib/utils/vDocContent'

/**
 * Provides hover information for embedded lua code
 * This is done by creating a virtual document and passing the hover request to the lua language
 * hover provider, in a method known as "request forwarding"
 *
 * This makes it possible to define hover behaviour for Lua code in and out of TSO files
 */
export default class TSOHoverProvider implements HoverProvider {
  async provideHover (document: TextDocument, position: Position): Promise<Hover | null> {
    // Obtain scope of hovered text
    const { scopes } = hs.getScopeAt(document, position) ?? { scopes: [] }
    // If current hover is occurring in embedded lua code, forward the hover request to the lua
    if (scopes.length > 1 && scopes[0] === 'source.tso' && scopes[1] === 'embedded.lua') {
      const originalUri = document.uri.toString(true)
      // Extract the embedded lua code from the TSO file
      const vdocContent = vDocContent.extract(vDocContent.SectionType.Lua, document)
      if (vdocContent === null) return null
      // Create a virtual document with the extracted lua code
      virtualDocumentContents.set(originalUri, vdocContent)
      // Forward the hover request to the lua language server
      return await commands.executeCommand<Hover | null>(
        'vscode.executeHoverProvider',
        Uri.parse(`tts-embedded-content://lua/${encodeURIComponent(originalUri)}.lua`),
        position
      )
    }
    return null
  }
}
