import { hs, triggers, virtualDocumentContents } from '@/providers'
import { Uri, type Position, commands, type TextDocument } from 'vscode'

/**
 * Available types of sections
 */
enum SectionType {
  Lua = 'script',
  XML = 'ui',
  yaml = 'object',
}

// export some type where the key is a string and the value is a SectionType
const AuthorityToType: Record<string, SectionType> = {
  lua: SectionType.Lua,
  xml: SectionType.XML,
  yaml: SectionType.yaml
}

/**
 * Extracts all blocks of a given type from a document, by replacing all non-block lines with newlines.
 * Conserving newlines allows for correct line numbers during request forwarding.
 * @param type The type of block to extract
 * @param document The document to extract from
 * @returns The extracted string
 */
function extract (type: SectionType, document: TextDocument): string {
  let result = ''
  let inTargetSection = false
  for (let i = 0; i < document.lineCount; i++) {
    const line = document.lineAt(i).text
    if (inTargetSection) result += line
    if (line.startsWith('```')) {
      const blockType = line.slice(3).trim()
      inTargetSection = blockType === type
    }
    result += '\n'
  }
  return result
}

export default async function executeVirtualCommand<T> ({
  command,
  allowedAuthorities,
  triggerCharacter,
  document,
  position
}: {
  command: string
  allowedAuthorities: string[]
  triggerCharacter?: string
  document: TextDocument
  position: Position
}): Promise<T | null> {
  const { scopes } = hs.getScopeAt(document, position) ?? { scopes: [] }
  if (scopes.length === 0) return null
  const authority = scopes[1].split('.')[1]
  if (!allowedAuthorities.includes(authority)) return null
  if (
    triggerCharacter !== undefined &&
    !triggers[authority].includes(triggerCharacter)
  ) return null
  const originalUri = document.uri.toString(true)
  const vdocContent = extract(AuthorityToType[authority], document)
  virtualDocumentContents.set(originalUri, vdocContent)
  return await Promise.resolve(commands.executeCommand<T>(
    command,
    Uri.parse(`tts-embedded-content://${authority}/${encodeURIComponent(originalUri)}.${authority}`),
    position,
    triggerCharacter
  ))
}
