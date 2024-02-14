import { FileManager } from '@/vscode/fileManager'
import { type PushingNewObject } from '@matanlurey/tts-editor'
import sanitizeFilename from '@/utils/sanitizeFilename'

export default async ({ scriptStates: [pushedObj] }: PushingNewObject): Promise<void> => {
  const objFs = new FileManager(`${sanitizeFilename(pushedObj.name)}.${pushedObj.guid}/Script.lua`)
  await objFs.open(pushedObj.script, { preview: true, preserveFocus: false })
}
