import { type SaveFile, type TTSObject } from '@tts-tools/savefile'
import getDirectoryName from '@/utils/getDirectoryNameFromTTSObject'
import { type OutgoingJsonObject } from '@matanlurey/tts-editor'

export default class SaveFileTree {
  constructor (private readonly saveFile: SaveFile) {
  }

  public getScriptPaths (): Set<string> {
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

  public getAPIFormattedObjects (): OutgoingJsonObject[] {
    const OutgoingObjects: OutgoingJsonObject[] = this.saveFile.ObjectStates.map(obj =>
      ({ guid: obj.GUID, script: obj.LuaScript, ui: obj.XmlUI })
    )
    // Don't forget the global script :)
    OutgoingObjects.push({ guid: '-1', script: this.saveFile.LuaScript, ui: this.saveFile.XmlUI })
    return OutgoingObjects
  }
}
