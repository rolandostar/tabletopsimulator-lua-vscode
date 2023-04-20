import { handleNoSavePathStored, handleWorkDirNotPresent } from '@/vscode/errorHandler'
import { getWorkDir, isPresentInWorkspace, isWorkdirDefault } from '@/vscode/workspaceManager'
import * as LSS from '@/utils/LocalStorageService'
import { FileManager } from '@/vscode/fileManager'
import { type GameObject } from '../CustomExternalEditorApi'
import { parse } from 'yaml'
import { type SaveState } from '@matanlurey/tts-save-files'
import { getEditorApi } from '..'

export default async function saveAndPlay (): Promise<void> {
  // When sending scripts, the workdir must be present in workspace
  if (!isPresentInWorkspace(getWorkDir())) { handleWorkDirNotPresent(); return }
  console.log('saveAndPlay done')
  // Collect from workdir
  const gameObjects = await readFiles()
  if (isWorkdirDefault()) {
    // If it's default, we just then send
  } else {
    // If it's not default, we need to read the savegame and modify it
    const savePath = LSS.get<string>('lastSavePath')
    if (savePath === undefined) { handleNoSavePathStored(); return }
    const saveMgr = new FileManager(savePath, false)
    // Reform savegame
    const savegame = await readSettings()
    savegame.ObjectStates = []
    for (const obj of gameObjects) {
      // TODO: objectProps
      const base = parse(obj.objectProps) // this should have ContainedObjects already
      base.XmlUI = obj.ui
      base.LuaScript = obj.script
      base.GUID = obj.guid
      savegame.ObjectStates.push(base)
    }
    // write to disk
    await saveMgr.write(JSON.stringify(savegame, null, 2))
    // send reload command to game
    // REVIEW: Do we really need to get Lua scripts?
    const res = await getEditorApi().getLuaScripts()
    await getEditorApi().saveAndPlay(res.scriptStates)
    console.log('saveAndPlay done')
  }
}

async function readFiles (): Promise<Array<GameObject & { objectProps: string }>> {
  console.log('readFiles')
  return []
}

async function readSettings (): Promise<Partial<SaveState>> {
  console.log('readSettings')
  return {}
}
