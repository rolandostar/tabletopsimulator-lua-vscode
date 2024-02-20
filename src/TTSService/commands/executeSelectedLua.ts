import { window } from 'vscode'
import { dirname } from 'path'
import isGuidValid from '@/utils/isGuidValid'
import TTSService from '..'

export default async function executeSelectedLua (script?: string, guid?: string): Promise<void> {
  // Get Current selection from vscode
  const editor = window.activeTextEditor
  // If no editor is open, fail silently
  if (editor === undefined) return
  script = editor.document.getText(editor.selection)
  // Check that script is defined and not empty
  if (script === '') {
    void window.showErrorMessage('No script selected')
    return
  }
  if (guid === undefined) {
    guid = dirname(editor.document.fileName).slice(-6)
    if (guid === undefined || !isGuidValid(guid)) guid = undefined
  }
  if (guid === undefined) guid = '-1'
  await TTSService.getApi().executeLuaCode(script, guid)
}
