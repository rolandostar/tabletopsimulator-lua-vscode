import { type DefinitionProvider, type TextDocument, type Position, type CancellationToken, Location, Uri, type Definition, type DefinitionLink, Range } from 'vscode'

export class LuaDefinitionProvider implements DefinitionProvider {
  public async provideDefinition (
    document: TextDocument, position: Position, token: CancellationToken):
    Promise<Definition | DefinitionLink[] | null> {
    const line = document.lineAt(position.line).text
    // Make sure the line contains require(
    if (!line.includes('require(')) return null
    const hoverText = document.getText(document.getWordRangeAtPosition(position, /["'][^"]+["']/))
    // if line contains require($hovertext)
    if (line.includes(`require(${hoverText})`)) {
      console.log(line)
      const u = Uri.file('C:\\Users\\Rolando\\Seafile\\Rolando Profesional\\Proyectos\\@Independiente\\tabletopsimulator-lua-2\\src\\lib\\tests\\fixture2\\objects\\Bag.7091eb.tso')
      return { uri: u, range: new Range(0, 0, 0, 0) }
    }
    return null
  }
}
