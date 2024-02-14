import getConfig from '@/utils/getConfig'
import { workspace } from 'vscode'
import { join } from 'path'
import { homedir } from 'os'

/**
 * Forms an array with directory paths where to look for files to be included
 * @param searchPattern - Patterns array to form paths with
 */
export function getSearchPaths (searchPattern?: string[]): string[] {
  searchPattern = searchPattern ?? getLuaSearchPatterns()
  const docsFolder = join(homedir(), 'Documents', 'Tabletop Simulator')
  const includePaths = getConfig<string[]>('fileManagement.includePaths')
  const vsFolders = workspace.workspaceFolders ?? []
  const paths = searchPattern
    .filter(pattern => pattern.length > 0)
    .map(pattern => [
      join(docsFolder, pattern),
      ...includePaths.map(p => join(p, pattern)),
      ...vsFolders.map(val => join(val.uri.fsPath, pattern)),
      pattern // For absolute paths
    ])
    // Flatten so all paths are in one top level array
    .reduce((acc, val) => acc.concat(val), [])
  // Flatten res
  if (getConfig<boolean>('misc.debugSearchPaths')) { console.log('[TTSLua] Search Paths:\n->', paths.join('\n-> '), '\n') }
  return paths
}

export function getLuaSearchPatterns (): string[] {
  return ['?.lua', '?.ttslua', '?']
}
