import { getWorkDir } from '@/vscode/workspaceManager'
import docsFolder from '@/utils/docsFolder'
import { join } from 'path'
import { workspace, Uri, FileType, FileSystemError } from 'vscode'

export const luaPatterns = ['?.lua', '?.ttslua']

// This is made as a function so it retrieves the latest workspace folders
export const getIncludePaths = (): string[] => [
  // Global Include folder has higher priority
  docsFolder,
  // Config Paths...,
  // Workspace Paths, starting by current workdir
  getWorkDir().fsPath,
  ...(
    (workspace.workspaceFolders?.map(f => f.uri.fsPath) ?? [])
      .filter(p => p !== getWorkDir().fsPath)
  )
]

export function getSearchPaths (): string[] {
  const paths = luaPatterns.flatMap(pt => getIncludePaths().map(p => join(p, pt)))
  paths.push(...luaPatterns)
  return paths
}

export async function locateModule (moduleName: string): Promise<Uri> {
  for (const path of getSearchPaths()) {
    const uri = Uri.file(path.replace('?', moduleName))
    // Check if the file exists
    try {
      const r = await workspace.fs.stat(uri)
      if (r.type === FileType.File) return uri
    } catch (error) {
      if (error instanceof FileSystemError) {
        if (error.code === 'FileNotFound') continue
      }
    }
  }
  throw new Error(`Module ${moduleName} not found`)
}
