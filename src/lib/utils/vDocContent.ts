import { type TextDocument } from 'vscode'

/**
 * Available types of sections
 */
export enum SectionType {
  Lua = 'script',
  XML = 'ui',
  yaml = 'object',
}

// export some type where the key is a string and the value is a SectionType
export const AuthorityToType: Record<string, SectionType> = {
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
export function extract (type: SectionType, document: TextDocument): string {
  let result = ''
  let inTargetSection = false
  for (let i = 0; i < document.lineCount; i++) {
    const line = document.lineAt(i).text
    if (line.startsWith('```')) {
      const blockType = line.slice(3).trim()
      inTargetSection = blockType === type
    }
    if (inTargetSection) result += line
    result += '\n'
  }
  return result
}
