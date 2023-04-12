import { type HoverProvider, type TextDocument, type Position, type Hover } from 'vscode'
import executeVirtualCommand from '@utils/requestForwarder'

/**
 * Provides hover information for embedded lua code
 * This is done by creating a virtual document and passing the hover request to the lua language
 * hover provider, in a method known as "request forwarding"
 *
 * This makes it possible to define hover behaviour for Lua code in and out of TSO files
 */
export default class TSOHoverProvider implements HoverProvider {
  async provideHover (document: TextDocument, position: Position): Promise<Hover | null> {
    return (await executeVirtualCommand<Hover[]>({
      command: 'vscode.executeHoverProvider',
      allowedAuthorities: ['lua'],
      document,
      position
    }) ?? [])[0]
  }
}
