/**
 * @file Error Handler - Handles errors thrown by the extension
 */

import { type FileSystemError, window } from 'vscode'
import L from '@/i18n'

export function workDirCreateFailed (reason: FileSystemError): void {
  const message = L.workDir.createFailed(reason.message)
  void window.showErrorMessage(message)
  throw new Error(message)
}

export function informGameNotRunning (): void {
  void window.showErrorMessage(
    L.errors.gameNotRunning() as string,
    { modal: true }
  )
}

export function informMultipleInstances (): void {
  void window.showErrorMessage(L.errors.anotherInstanceRunning() as string, {
    modal: true,
    detail: L.errors.anotherInstanceRunningDetail() as string
  })
}

export function handleWorkDirNotPresent (): void {
  void window.showErrorMessage(
    'The workspace does not contain the selected Working Directory.\n' +
      'Get Lua Scripts from game before trying to Save and Play.',
    { modal: true }
  )
  throw new Error('WorkDir not present')
}

export function handleNoSavePathStored (): void {
  void window.showErrorMessage(
    'Error occured while saving, please reload your game before trying to Save and Play.',
    { modal: true }
  )
  throw new Error('No save path stored')
}
