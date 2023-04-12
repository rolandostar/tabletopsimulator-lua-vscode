import {
  type DefinitionProvider, type TextDocument, type Position, type CancellationToken, type Location,
  type Uri, type LocationLink, type Definition, type DefinitionLink, type Range
} from 'vscode'
import executeVirtualCommand from '@utils/requestForwarder'

export class TSODefinitionProvider implements DefinitionProvider {
  public async provideDefinition (
    document: TextDocument, position: Position, token: CancellationToken):
    Promise<Definition | DefinitionLink[] | null> {
    return (await executeVirtualCommand<Location[] | LocationLink[]>({
      command: 'vscode.executeDefinitionProvider',
      allowedAuthorities: ['lua', 'xml', 'yaml'],
      document,
      position
    }))?.map((loc: Location | LocationLink) => {
      const isLocationLink = 'targetUri' in loc && 'targetRange' in loc
      let uri: Uri = isLocationLink ? loc.targetUri : loc.uri
      const range: Range = isLocationLink ? loc.targetRange : loc.range
      if (
        // If the command returned a self-reference, replace it with the current document's uri
        uri.toString(true).toLowerCase().includes(document.uri.toString(true).toLowerCase())
      ) uri = document.uri
      return { uri, range }
    }) ?? null
  }
}
