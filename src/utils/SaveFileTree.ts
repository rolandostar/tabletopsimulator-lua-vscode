import { type SaveFile, type TTSObject } from '@tts-tools/savefile'
import getDirectoryName from '@/utils/getDirectoryNameFromTTSObject'

export default class SaveFileStorage {
  private static instance: SaveFileStorage
  private constructor (public readonly saveFile: SaveFile) {
  }

  public static set (saveFile: SaveFile): SaveFileStorage {
    SaveFileStorage.instance = new SaveFileStorage(saveFile)
    return SaveFileStorage.instance
  }

  public static get (): SaveFileStorage {
    if (SaveFileStorage.instance === undefined) throw new Error('No save file loaded')
    return SaveFileStorage.instance
  }

  public getScriptPaths (): Set<string> {
    if (this.saveFile === undefined) throw new Error('No save file loaded')
    const result = new Set<string>()
    if ((this.saveFile.LuaScript?.length ?? 0) > 0) result.add('Script.lua')

    const getContainedObjectScripts = (parent: TTSObject, parentPath: string): void => {
      for (const obj of parent.ContainedObjects ?? []) {
        const descriptor = parentPath + getDirectoryName(obj) + '/'
        if ((obj.LuaScript?.length ?? 0) > 0) result.add(`${descriptor}Script.lua`)
        if (obj.ContainedObjects !== undefined) getContainedObjectScripts(obj, descriptor)
      }
    }

    this.saveFile.ObjectStates.forEach(obj => {
      const descriptor = getDirectoryName(obj) + '/'
      if ((obj.LuaScript?.length ?? 0) > 0) result.add(`${descriptor}Script.lua`)
      getContainedObjectScripts(obj, descriptor)
    })
    return result
  }
}
