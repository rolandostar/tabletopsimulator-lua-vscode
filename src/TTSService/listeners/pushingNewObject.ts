import { FileManager } from '@/vscode/fileManager'
import { type PushingNewObject } from '@matanlurey/tts-editor'
import sanitizeFilename from '@/utils/sanitizeFilename'

export default async ({ scriptStates: [pushedObj] }: PushingNewObject): Promise<void> => {
  console.log('Pushing new object')
  const objFs = new FileManager(`objects/${sanitizeFilename(pushedObj.name)}.${pushedObj.guid}.lua`)
  await objFs.open(pushedObj.script, { preview: true, preserveFocus: false })
}
