import { handleNoSavePathStored, handleWorkDirNotPresent } from '@/vscode/errorHandler'
import { getWorkDir, isPresentInWorkspace } from '@/vscode/workspaceManager'
import * as LSS from '@/utils/LocalStorageService'
import { FileManager } from '@/vscode/fileManager'
import TTSService from '@/TTSService'
import { embedSave } from '@tts-tools/savefile'
import saveFileToAPI from '@/utils/saveFileToAPI'

export default async function saveAndPlay (): Promise<void> {
  // When sending scripts, the workdir must be present in workspace
  if (!isPresentInWorkspace(getWorkDir())) { handleWorkDirNotPresent(); return }
  const savePath = LSS.get<string>('lastSavePath')
  if (savePath === undefined) { handleNoSavePathStored(); return }
  const saveFs = new FileManager(savePath, false)
  const saveFile = embedSave(getWorkDir().fsPath, {
    scriptExtension: 'lua',
    includePaths: [
      getWorkDir().fsPath
    ]
  })
  await saveFs.write(JSON.stringify(saveFile, null, 2))

  await TTSService.getApi().saveAndPlay(saveFileToAPI(saveFile))

  // const res = await TTSService.getApi().getLuaScripts()
  // await TTSService.getApi().saveAndPlay(res.scriptStates)
  console.log('saveAndPlay done')
  // const gameObjects = await readFiles()
  // if (isWorkdirDefault()) {
  //   // If it's default, we just then send
  // } else {
  //   // If it's not default, we need to read the savegame and modify it
  //   const savePath = LSS.get<string>('lastSavePath')
  //   if (savePath === undefined) { handleNoSavePathStored(); return }
  //   const saveMgr = new FileManager(savePath, false)
  //   // Reform savegame
  //   const savegame = await readSettings()
  //   savegame.ObjectStates = []
  //   for (const obj of gameObjects) {
  //     // TODO: objectProps
  //     const base = parse(obj.objectProps) // this should have ContainedObjects already
  //     base.XmlUI = obj.ui
  //     base.LuaScript = obj.script
  //     base.GUID = obj.guid
  //     savegame.ObjectStates.push(base)
  //   }
  //   // write to disk
  //   await saveMgr.write(JSON.stringify(savegame, null, 2))
  //   // send reload command to game
  //   // REVIEW: Do we really need to get Lua scripts?
  //   const res = await TTSService.getApi().getLuaScripts()
  //   await TTSService.getApi().saveAndPlay(res.scriptStates)
  //   console.log('saveAndPlay done')
  // }
}
