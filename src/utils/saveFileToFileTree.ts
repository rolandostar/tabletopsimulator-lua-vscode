import { type SaveFile, type TTSObject } from '@tts-tools/savefile'

export default class FileTree {
  constructor (private readonly saveFile: SaveFile) {
  }

  public getScriptPaths (): Set<string> {
    const result = new Set<string>()
    if ((this.saveFile.LuaScript?.length ?? 0) > 0) result.add('Script.lua')

    const getContainedObjectScripts = (parent: TTSObject, parentPath: string): void => {
      for (const obj of parent.ContainedObjects ?? []) {
        const descriptor = `${parentPath}${obj.Nickname.length === 0 ? obj.Name : obj.Nickname}.${obj.GUID}/`
        if ((obj.LuaScript?.length ?? 0) > 0) {
          result.add(`${descriptor}Script.lua`)
        }
        if (obj.ContainedObjects !== undefined) getContainedObjectScripts(obj, descriptor)
      }
    }

    this.saveFile.ObjectStates.forEach(obj => {
      const descriptor = `${obj.Nickname.length === 0 ? obj.Name : obj.Nickname}.${obj.GUID}/`
      if ((obj.LuaScript?.length ?? 0) > 0) result.add(`${descriptor}Script.lua`)
      getContainedObjectScripts(obj, descriptor)
    })
    return result
  }
}
