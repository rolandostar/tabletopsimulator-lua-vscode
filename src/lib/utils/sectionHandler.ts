import { type TextDocument } from 'vscode'

/**
 * Available types of sections
 */
export enum SectionType {
  Lua = 'script',
  XML = 'ui',
  json = 'object',
}

// export some type where the key is a string and the value is a SectionType
export const AuthorityToType: Record<string, SectionType> = {
  lua: SectionType.Lua,
  xml: SectionType.XML,
  json: SectionType.json
}

/**
 * Extracts all blocks of a given type from a document, and returns them as a single string
 * separated by newlines. If no blocks are found, returns null.
 * @param type The type of block to extract
 * @param document The document to extract from
 * @returns The extracted string, or null if no blocks were found
 */
export function extract (type: SectionType, document: TextDocument): string | null {
  const regex = new RegExp('```' + type + '([\\s\\S]*?)```', 'g')
  const blocks = [...document.getText().matchAll(regex)]
  if (blocks == null) return null
  return blocks.map(b => b[1].trim()).join('\n')
}
