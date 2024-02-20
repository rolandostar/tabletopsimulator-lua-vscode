import { handleNoSavePathStored, handleWorkDirNotPresent } from '@/vscode/errorHandler'
import { getWorkDir, isPresentInWorkspace } from '@/vscode/workspaceManager'
import * as LSS from '@/utils/LocalStorageService'
import FileManager from '@/vscode/fileManager'
import TTSService from '@/TTSService'
import { embedSave } from '@tts-tools/savefile'
import SaveFileTree from '@/utils/SaveFileTree'
import docsFolder from '@/utils/docsFolder'

export default async function saveAndPlay (): Promise<void> {
  // When sending scripts, the workdir must be present in workspace
  if (!isPresentInWorkspace(getWorkDir())) { handleWorkDirNotPresent(); return }
  // Retrieve the save path we stored when loading the game
  const savePath = LSS.get<string>('lastSavePath')
  if (savePath === undefined) { handleNoSavePathStored(); return }
  const saveFs = new FileManager(savePath, false)
  let saveFile
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
  const saveFileTree = new SaveFileTree(saveFile)
  await TTSService.getApi().saveAndPlay(saveFileTree.getAPIFormattedObjects())
}
