import { handleNoSavePathStored, handleWorkDirNotPresent } from '@/vscode/errorHandler'
import { getWorkDir, isPresentInWorkspace } from '@/vscode/workspaceManager'
import * as LSS from '@/utils/LocalStorageService'
import FileManager from '@/vscode/fileManager'
import TTSService from '@/TTSService'
import { type SaveFile, embedSave } from '@tts-tools/savefile'
import docsFolder from '@/utils/docsFolder'
import { type OutgoingJsonObject } from '@matanlurey/tts-editor'

export default async function saveAndPlay (): Promise<void> {
  // When sending scripts, the workdir must be present in workspace
  if (!isPresentInWorkspace(getWorkDir())) { handleWorkDirNotPresent(); return }
  // Retrieve the save path we stored when loading the game
  const savePath = LSS.get<string>('lastSavePath')
  if (savePath === undefined) { handleNoSavePathStored(); return }
  const saveFs = new FileManager(savePath, false)
  let saveFile: SaveFile
  try {
    saveFile = embedSave(getWorkDir().fsPath, {
      scriptExtension: 'lua',
      includePaths: [
        getWorkDir().fsPath,
        docsFolder
      ]
    })
  } catch (e) {
    console.error(e)
    throw new Error('Failed to embed save')
  }
  await saveFs.write(JSON.stringify(saveFile, null, 2))
  const OutgoingObjects: OutgoingJsonObject[] = saveFile.ObjectStates.map(obj =>
    ({ guid: obj.GUID, script: obj.LuaScript, ui: obj.XmlUI })
  )
  // Don't forget the global script :)
  OutgoingObjects.push({ guid: '-1', script: saveFile.LuaScript, ui: saveFile.XmlUI })
  await TTSService.getApi().saveAndPlay(OutgoingObjects)
}
