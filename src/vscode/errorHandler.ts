import { type FileSystemError, window } from 'vscode'
import L from '@/i18n'

export function workDirCreateFailed (reason: FileSystemError): void {
  const message = L.workDir.createFailed(reason.message)
  void window.showErrorMessage(message)
  throw new Error(message)
}
