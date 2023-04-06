import { workspace, type FileSystemError, type Uri } from 'vscode'
import L from '@/i18n'

export default async function uriExists (uri: Uri): Promise<boolean> {
  await Promise.resolve(workspace.fs.stat(uri)).catch((err: FileSystemError) => {
    if (err.code === 'FileNotFound') return false
    console.error(L.errors.uriStatUnexpected(uri.fsPath, err.message))
    throw err
  })
  return true
}
