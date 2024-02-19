import TTSConsolePanel from '@/TTSConsole'
import { getWorkDir } from '@/vscode/workspaceManager'
import { type ErrorMessage } from '@matanlurey/tts-editor'
import { window, Range, Uri } from 'vscode'
import { unbundleString } from 'luabundle'
import TTSService from '@/TTSService'
import getDirectoryNameFromTTSObject from '@/utils/getDirectoryNameFromTTSObject'
import { locateModule } from '@/utils/moduleResolution'
import { NoBundleMetadataError } from 'luabundle/errors'
import L from '@/i18n'

export default async (message: ErrorMessage): Promise<void> => {
  const errorPattern = message.error.match(/.*:\((\d*),(\d*)-(\d*)\):/)
  if (errorPattern === null) {
    // The Error is from execute lua or no pattern found, no button is needed
    void TTSConsolePanel.currentPanel?.append(message.errorMessagePrefix, { classes: ['callout', 'error'] })
    void window.showErrorMessage(message.errorMessagePrefix)
    return
  }
  // Create the Error Range from the match
  const isGlobal = message.guid === '-1'
  const [, mLine, mStart, mEnd] = errorPattern
  const errorRange = new Range(
    parseInt(mLine) - 1, parseInt(mStart), parseInt(mLine) - 1, parseInt(mEnd))
  // Find the errored script from the recently sent files, we use GUID for this
  const gameResponse = await TTSService.getApi().getLuaScripts()
  const offendingObject = gameResponse.scriptStates.find(s => s.guid === message.guid)
  // TODO - Handle error
  if (offendingObject === undefined) throw Error('No offending object found')
  let offendingModuleUri: Uri
  try {
    // First we attempt to unbundle to get line and column numbers across modules
    const script = unbundleString(offendingObject.script)
    // Find the module which contains the extracted errorRange
    const offendingModuleKey = Object.keys(script.modules).find(moduleName => {
      const m = script.modules[moduleName]
      return new Range(m.start.line, m.start.column, m.end.line, m.end.column)
        .contains(errorRange)
    })
    if (offendingModuleKey === undefined) throw Error('No offending module found')
    // Once identified, we need to find the module's URI, where we look for depends on if it's the root module and/or global
    const offendingModule = script.modules[offendingModuleKey]
    const isRoot = offendingModule.name === script.metadata.rootModuleName
    offendingModuleUri = isRoot
      ? Uri.joinPath(getWorkDir(), isGlobal ? '' : getDirectoryNameFromTTSObject(offendingObject), '/Script.lua')
      : await locateModule(offendingModule.name)
    if (offendingModuleUri === undefined) throw Error('No offending module found')
    // Calculate the offset range to show the error in the correct position
    const offsetRange = new Range(
      errorRange.start.translate(-offendingModule.start.line + 1),
      errorRange.end.translate(-offendingModule.start.line + 1)
    )
    // Step 4: Show the error message with a button to jump to the error
    await showJumpToErrorButton(fmtMessage(message, offsetRange,
      !isRoot ? offendingModule.name : isGlobal ? 'Global' : getDirectoryNameFromTTSObject(offendingObject)
    ), offendingModuleUri, offsetRange)
  } catch (error) {
    if (!(error instanceof NoBundleMetadataError)) {
      throw error
    }
    // If the script is not bundled, we skip offset calculation and module resolution
    const dirName = getDirectoryNameFromTTSObject(offendingObject)
    offendingModuleUri = Uri.joinPath(getWorkDir(), message.guid !== '-1' ? dirName : '', '/Script.lua')
    await showJumpToErrorButton(
      fmtMessage(message, errorRange, dirName), offendingModuleUri, errorRange)
  }
}

const fmtMessage = (msg: ErrorMessage, errorRange: Range, moduleName: string): string => {
  const msgArray = msg.error.split(':')
  return `Error in Script (${moduleName}): ${msgArray[0]}(${errorRange.start.line + 1},${errorRange.start.character + 1}-${errorRange.end.character + 1}): ${msgArray.at(-1)}`
}

async function showJumpToErrorButton (
  message: string,
  offendingModuleUri: Uri,
  errorRange: Range
): Promise<void> {
  const option = await window.showErrorMessage(message, L.errors.goToErrorButton())
  if (option !== L.errors.goToErrorButton()) return
  await window.showTextDocument(offendingModuleUri, { selection: errorRange })
}
