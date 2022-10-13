import * as path from 'path';
import * as vscode from 'vscode';
import * as ws from '../vscode/workspace';

/**
 * Forms an array with directory paths where to look for files to be included
 * @param searchPattern - Patterns array to form paths with
 */
export function getSearchPaths(searchPattern: string[]): string[] {
  const includePaths: string[] =
    vscode.workspace.getConfiguration('ttslua.fileManagement').get('includePaths') || [];
  const vsFolders = vscode.workspace.workspaceFolders || [];
  const paths = searchPattern
    .filter((pattern) => pattern.length > 0)
    .map((pattern) => [
      path.join(ws.docsFolder, pattern),
      ...includePaths.map((p) => path.join(p, pattern)),
      ...vsFolders.map((val) => path.join(val.uri.fsPath, pattern)),
      pattern, // For absolute paths
    ])
    // Flatten so all paths are in one top level array
    .reduce((acc, val) => acc.concat(val), []);
  // Flatten res
  if (vscode.workspace.getConfiguration('ttslua.misc').get('debugSearchPaths'))
    console.log('[TTSLua] Search Paths:\n->', paths.join('\n-> '), '\n');
  return paths;
}

export function getLuaSearchPatterns(): string[] {
  return ['?', '?.lua'];
}
