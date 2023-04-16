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

export function handleGameNotRunning (): void {
  void window.showErrorMessage(
    'Unable to connect to Tabletop Simulator.\n\n' +
      'Check that the game is running and a save has been loaded.',
    { modal: true }
  )
  throw new Error('Game not running')
}

export function handleMultipleInstances (): void {
  void window.showErrorMessage('Another instance of TTSLua or Atom is already running', {
    modal: true,
    detail: 'Please close the other instance and try again.'
  })
  throw new Error('Multiple instances')
}
