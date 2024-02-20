import FileManager from '@/vscode/fileManager'
import { type PushingNewObject } from '@matanlurey/tts-editor'
import getDirectoryName from '@/utils/getDirectoryNameFromTTSObject'
import { type TextEditor } from 'vscode'

/**
 * Opens the script of the pushed object
 * @param pushedObj - The object that was pushed
 * @returns A promise that resolves when the script is opened
 */
export default async ({ scriptStates: [pushedObj] }: PushingNewObject): Promise<TextEditor> => {
  const objFs = new FileManager(getDirectoryName(pushedObj) + '/Script.lua')
  return await objFs.open(pushedObj.script, { preview: true, preserveFocus: false })
}
